import { Layout } from "@/components/layout/Layout.jsx";
import { Container, Title, Caption, PrimaryButton, LoadingSpinner, AuctionCommentSection } from "@/components/ui/index.js";
import { auctionService } from "@/services/auction.service.js";
import { bidService } from "@/services/bid.service.js";
import { useMemo, useState, useRef } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getAccessToken } from "@/utils/token-storage.js";
import { useUser } from "@/contexts/UserContext.jsx";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useEffect } from "react";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import AuctionWinnerPopup from "@/features/auctions/AuctionWinnerPopup.jsx";

const statusBadgeClass = (status) => ({
  PENDING: "text-gray-700 bg-yellow-400",
  READY: "text-blue-700 bg-blue-200",
  OPEN: "text-white bg-green",
  CLOSED: "text-gray-700 bg-gray-200",
  CANCELED: "text-red-700 bg-red-200",
  COMPLETED: "text-blue-500 bg-slate-200",
  EXTENDED: "text-orange-700 bg-orange-200",
}[status] || "text-black bg-white");

const formatMoney = (n) => {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const useCountdown = (end) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const endTime = end ? new Date(end) : null;
  const timeLeft = endTime ? Math.max(0, endTime - now) : Number.POSITIVE_INFINITY;
  const isOver = timeLeft <= 0;
  const days = isOver ? 0 : Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = isOver ? 0 : Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = isOver ? 0 : Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = isOver ? 0 : Math.floor((timeLeft / 1000) % 60);
  return { days, hours, minutes, seconds, isOver, timeLeftMs: timeLeft };
};

const AuctionDetail = () => {
  const { auctionId } = useParams();
  const [searchParams] = useSearchParams();
  const highlightCommentId = searchParams.get('highlightComment');
  const { user } = useUser();
  const { showToastNotification } = useNotification();
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hiddenSubmitted, setHiddenSubmitted] = useState(false);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);

  const socketRef = useRef(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const { days, hours, minutes, seconds, isOver, timeLeftMs } = useCountdown(auction?.endTime);

  const canBidStatus = auction?.status === "OPEN" || auction?.status === "EXTENDED";
  const isSellerOwner = user && auction && user.id === auction.sellerId;
  const isSeller = user && auction && user.role === "SELLER";
  const isAdmin = user && auction && user.role === "ADMIN";
  const canBid = user && user.role === "BIDDER" && !isSellerOwner && !isSeller && canBidStatus && !isOver;

  const isLast10Min = canBidStatus && timeLeftMs > 0 && timeLeftMs <= 10 * 60 * 1000;

  // Bid input
  const minBid = useMemo(() => {
    const current = Number(auction?.currentPrice || 0);
    const step = Number(auction?.minimumBidIncrement || 0);
    return current + step;
  }, [auction]);

  const [bidInput, setBidInput] = useState("");
  const [hiddenInputs, setHiddenInputs] = useState(["", "", ""]);
  const [hasShownHiddenBidNotification, setHasShownHiddenBidNotification] = useState(false);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    setBidInput(minBid ? String(minBid) : "");
  }, [minBid]);

  // Auto-switch to hidden bid mode in last 10 minutes
  useEffect(() => {
    if (isLast10Min && !isSellerOwner && canBid && !hasShownHiddenBidNotification) {
      setBidInput("");

      showToastNotification("Last 10 minutes: Switched to hidden bid mode", "info");
      setHiddenInputs([minBid, minBid, minBid]);
      setHasShownHiddenBidNotification(true);
    }
    // Reset notification state if user/auction context changes
    if (!isLast10Min || isSellerOwner || !canBid) {
      setHasShownHiddenBidNotification(false);
    }
  }, [isLast10Min, isSellerOwner, canBid, showToastNotification, hasShownHiddenBidNotification, minBid]);

  // Get auction detail by id
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const data = await auctionService.getAuctionById(auctionId);
        console.log(data);
        if (mounted) setAuction(data);
      } catch (err) {
        if (mounted) setFetchError(err?.message || "Failed to load auction");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [auctionId]);

  // Get bid list
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await bidService.getBids(auctionId);
        setBids(data);
      } catch {
        setBids([]); // hoặc showToastNotification("Failed to load bid history", "error");
      }
    };
    if (auctionId) fetchBids();
  }, [auctionId]);

  // WebSocket setup
  useEffect(() => {
    if (!user) return;

    const token = getAccessToken();
    if (!token) return;

    const socket = io(`${import.meta.env.VITE_BACKEND_URL}/auction`, {
      auth: { token: token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // Kết nối xong thì join room
    socket.on("connection_success", () => {
      socket.emit("join_auction", { auctionId });
    });

    // Thông báo nếu có lỗi
    socket.on("error", (err) => {
      showToastNotification(err.message || "WebSocket error", "error");
    });

    // Nhận lịch sử bid ban đầu
    socket.on("bid_history", (data) => {
      setAuction((prev) => ({
        ...prev,
        bids: data.bidHistory,
        currentPrice: data.bidHistory[0]?.amount || prev?.currentPrice
      }));
    });

    // Xác nhận join thành công cho chính user
    socket.on("join_auction_success", (data) => {
      showToastNotification(data.message, "success");
    });

    // Broadcast khi user khác join
    socket.on("user_joined_auction", (data) => {
      showToastNotification(data.message, "info");
    });

    // Xác nhận rời room cho chính user
    socket.on("leave_auction_success", (data) => {
      showToastNotification(data.message, "info");
    });

    // Broadcast khi user khác rời room
    socket.on("user_left_auction", (data) => {
      showToastNotification(data.message, "info");
    });

    // Update realtime bids và current price
    socket.on("bid_accepted", (data) => {
      console.log(data.bid.amount);
      const bid = {
        ...data.bid,
        bidAmount: Number(data.bid.amount || data.bid.bidAmount || 0),
        createdAt: data.bid.createdAt ? new Date(data.bid.createdAt) : new Date(),
        username: data.bid.username || "Unknown",
        bidId: data.bid.bidId || Math.random().toString(36).slice(2, 9),
      };

      setBids((prev) => [bid, ...prev]);
      // setBids((prev) => [data.bid, ...prev]);
      setAuction((prev) => ({
        ...prev,
        currentPrice: data.bid.amount,
      }));
    });

    // Kết thúc auction
    socket.on("auction_ended", (data) => {
      console.log("winner", data);
      console.log(data.winner);
      setWinner(data.winner);
      showToastNotification(`Auction ${data.auctionId} ended. Winner: ${data.winner?.email}`, "info");
      if (user && data.winner && user.id === data.winner.userId) {
        setShowWinnerPopup(true);
      }
    });

    // Sự kiện khi rời auction / disconnect
    const handleBeforeUnload = () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_auction", { auctionId });
        socketRef.current.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup khi unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_auction", { auctionId });
        socketRef.current.disconnect();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [auctionId, showToastNotification, user]);

  // Emit auction end event
  useEffect(() => {
    console.log(timeLeftMs);
    if (timeLeftMs <= 0 && socketRef.current) {
      socketRef.current.emit("auction_ended", { auctionId });
      const refreshAuction = async () => {
        try {
          const data = await auctionService.getAuctionById(auctionId);
          setAuction(data);
        } catch (error) {
          // keep old state on refresh error
          console.error('Failed to refresh auction:', error);
        }
      };
      refreshAuction();
    }
  }, [timeLeftMs, auctionId]);

  // Check if auction is in user's watchlist
  const checkWatchlistStatus = async () => {
    if (!user || user.role !== "BIDDER") return;

    try {
      const watchlistData = await auctionService.getWatchlist();
      const isInList = watchlistData.data?.some(item => item.auctionId === auctionId);
      setIsInWatchlist(isInList);
    } catch (error) {
      console.error("Failed to check watchlist status:", error);
    }
  };

  // Add to watchlist
  const handleAddToWatchlist = async () => {
    if (!user || user.role !== "BIDDER") {
      showToastNotification("Please log in as a bidder to use watchlist", "error");
      return;
    }

    try {
      setWatchlistLoading(true);
      await auctionService.addToWatchlist(auctionId);
      setIsInWatchlist(true);
      showToastNotification("Added to watchlist", "success");
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      showToastNotification(error.message || "Failed to add to watchlist", "error");
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Remove from watchlist
  const handleRemoveFromWatchlist = async () => {
    if (!user || user.role !== "BIDDER") return;

    try {
      setWatchlistLoading(true);
      await auctionService.removeFromWatchlist(auctionId);
      setIsInWatchlist(false);
      showToastNotification("Removed from watchlist", "success");
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      showToastNotification(error.message || "Failed to remove from watchlist", "error");
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Check watchlist status when auction loads
  useEffect(() => {
    if (auction && user?.role === "BIDDER") {
      checkWatchlistStatus();
    }
  }, [auction, user]);

  const handlePlaceBid = async () => {
    if (!canBid) return;

    const confirmMsg = isLast10Min
      ? "Are you sure you want to submit hidden bids?"
      : `Are you sure you want to place a bid of $${formatMoney(bidInput)}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setSubmitting(true);
      if (!isLast10Min) {
        const amount = Number(bidInput);
        const step = Number(auction?.minimumBidIncrement || 0);
        const current = Number(auction?.currentPrice || 0);

        if (!amount || amount < minBid) {
          showToastNotification(`Minimum bid: $${formatMoney(minBid)}`, "error");
          return;
        }

        // robust multiple-of-increment check using cents
        const toCents = (n) => Math.round(Number(n) * 100);
        const diffCents = toCents(amount) - toCents(current);
        const stepCents = toCents(step);
        if (stepCents > 0 && (diffCents % stepCents) !== 0) {
          showToastNotification(
            `Bid must be a multiple of the increment ($${formatMoney(step)})`,
            "error"
          );
          return;
        }

        if (socketRef.current) {
          console.log(amount);
          socketRef.current.emit("place_bid", { auctionId, bidAmount: amount }, (response) => {
            if (response?.success) {
              showToastNotification("Bid placed successfully", "success");
            } else {
              showToastNotification(response?.message || "Failed to place bid", "error");
            }
          });
        } else {
          showToastNotification("Socket not connected", "error");
        }
      } else {
        const values = hiddenInputs
          .map((v) => Number(v))
          .filter((v) => Number.isFinite(v) && v > 0);

        if (values.length === 0) {
          showToastNotification("Please enter at least 1 hidden bid amount", "error");
          return;
        }
        if (values.length > 3) {
          showToastNotification("You can enter up to 3 hidden bid amounts only", "error");
          return;
        }
        await bidService.placeHiddenBids({ auctionId, bidAmounts: values });
        setHiddenSubmitted(true);
        showToastNotification("Hidden bids submitted successfully", "success");
      }
    } catch (err) {
      let errorMessage = "Failed to place bid";

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.errorCode) {
        errorMessage = err.response.data.message || `Error: ${err.response.data.errorCode}`;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.statusCode === 400) {
        errorMessage = "Invalid bid request. Please check your input.";
      } else if (err?.statusCode === 401) {
        errorMessage = "Please log in to place a bid.";
      } else if (err?.statusCode === 403) {
        errorMessage = "You don't have permission to place bids.";
      } else if (err?.statusCode === 404) {
        errorMessage = "Auction not found.";
      } else if (err?.statusCode >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      showToastNotification(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading auction..." />
      </Layout>
    );
  }

  if (fetchError || !auction) {
    return (
      <Layout>
        <Container className="py-8">
          <div className="text-center">
            <Title level={2} className="text-gray-900 mb-4">Auction not found</Title>
            <p className="text-gray-600">{fetchError || "We couldn't load this auction."}</p>
          </div>
        </Container>
      </Layout>
    );
  }

  const handleLeaveAuction = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave_auction", { auctionId });
    }
    navigate("/auctions");
  };

  const products = auction.products || [];

  return (
    <Layout>
      <Container className="py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <Title level={2} className="text-gray-900 mb-2">{auction.title}</Title>
            <div className="flex items-center gap-3">
              <Caption className={`px-3 py-1 text-sm rounded-full ${statusBadgeClass(auction.status)}`}>
                {auction.status}
              </Caption>
              <Caption className="text-green bg-green_100 px-3 py-1 text-sm rounded-full">
                Current: ${formatMoney(auction.currentPrice)}
              </Caption>
              <Caption className="text-gray-700 bg-gray-100 px-3 py-1 text-sm rounded-full">
                Min increment: ${formatMoney(auction.minimumBidIncrement)}
              </Caption>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Watchlist Button - Only for bidders */}
            {user?.role === "BIDDER" && (
              <button
                onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                disabled={watchlistLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isInWatchlist
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } disabled:opacity-50`}
                title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                {watchlistLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isInWatchlist ? (
                  <IoHeart className="w-5 h-5" />
                ) : (
                  <IoHeartOutline className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </span>
              </button>
            )}

            {/* Time left */}
            <div className="text-right">
              <Caption className="text-green">Time left</Caption>
              <Title>
                {days}d : {hours}h : {minutes}m : {seconds}s
              </Title>
            </div>
          </div>
        </div>

        {/* Seller */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <Caption className="text-gray-600">Seller</Caption>
                <Title level={4} className="text-gray-900">{auction.sellerName || "Unknown"}</Title>
              </div>
            </div>
            {!isSellerOwner && (
              <Link to={`/seller/${auction.sellerId}`} className="text-green hover:underline">
                View seller profile
              </Link>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images & Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <Title level={4} className="mb-4">Products</Title>
              {products.length === 0 ? (
                <Caption className="text-gray-600">No products attached.</Caption>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.productId} className="border rounded-lg overflow-hidden">
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <div className="font-semibold text-gray-900 mb-1">{p.name}</div>
                        {p.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
                        )}
                        <div className="mt-2 text-sm text-gray-700">Qty: {p.quantity}</div>
                        {p.categories && p.categories.length > 0 && (
                          <div className="mt-2">
                            <Caption className="text-gray-600">Categories:</Caption>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {p.categories.map((c) => (
                                <span key={c} className="px-2 py-1 text-xs bg-gray-100 rounded-full">{c}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Winner info */}
            {winner && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <Title level={4} className="text-green-700 mb-2">Auction Ended</Title>
                <p className="text-gray-700">
                  Winner: <span className="font-semibold">{winner.username}</span>
                </p>
                <p className="text-gray-600">User ID: {winner.userId}</p>
              </div>
            )}

            {/* Bid history */}
            <div className="bg-white rounded-lg shadow p-4">
              <Title level={4} className="mb-4">Bid history</Title>
              {bids.length === 0 ? (
                <Caption className="text-gray-600">No bids yet.</Caption>
              ) : (
                <div className="space-y-3">
                  {bids.map((b) => (
                    <div key={b.bidId} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium text-gray-900">{b.username}</div>
                        <Caption className="text-gray-600">{new Date(b.createdAt).toLocaleString()}</Caption>
                      </div>
                      <div className="text-right">
                        <Caption className="text-gray-600">Bid</Caption>
                        <Title level={4}>${formatMoney(Number(b.bidAmount))}</Title>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Place bid */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <Title level={4} className="mb-2">
                {isLast10Min ? "Hidden Bids (Last 10 minutes)" : "Place a bid"}
              </Title>

              {/* Warning banner for last 10 minutes */}
              {isLast10Min && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.987-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-orange-800 text-sm font-medium">
                      Last 10 minutes - Hidden bid mode activated
                    </span>
                  </div>
                </div>
              )}

              {!isLast10Min ? (
                <>
                  <Caption className="text-gray-600 mb-4 block">
                    Minimum allowed: ${formatMoney(minBid)}
                  </Caption>
                  <input
                    type="number"
                    min={minBid}
                    step={auction?.minimumBidIncrement || 1}
                    value={bidInput}
                    onChange={(e) => setBidInput(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded mb-4 outline-none focus:ring-2 focus:ring-green"
                  />
                  <PrimaryButton
                    className="w-full py-3 rounded-lg"
                    onClick={handlePlaceBid}
                    disabled={!canBid || submitting || (!isLast10Min && Number(bidInput) < minBid)}
                  >
                    {submitting
                      ? "Submitting..."
                      : canBid
                        ? (isLast10Min ? "Submit Hidden Bids" : "Place Bid")
                        : "Bidding not available"}
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <Caption className="text-gray-600 mb-4 block">
                    Enter up to 3 hidden bid amounts (can leave blank).
                  </Caption>
                  <div className="space-y-2 mb-4">
                    {hiddenInputs.map((v, i) => (
                      <input
                        key={i}
                        type="number"
                        min={minBid}
                        step={auction?.minimumBidIncrement || 1}
                        value={v}
                        onChange={(e) => {
                          const next = [...hiddenInputs];
                          next[i] = e.target.value;
                          setHiddenInputs(next);
                        }}
                        placeholder={`Hidden bid #${i + 1}`}
                        className="w-full p-3 border border-gray-200 rounded outline-none focus:ring-2 focus:ring-green"
                      />
                    ))}
                  </div>
                  <PrimaryButton
                    className={`w-full py-3 rounded-lg ${hiddenSubmitted || !canBid
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    onClick={handlePlaceBid}
                    disabled={hiddenSubmitted}
                  >
                    {submitting
                      ? "Submitting..."
                      : canBid
                        ? "Submit Hidden Bids"
                        : "Bidding not available"}
                  </PrimaryButton>
                </>
              )}
              <PrimaryButton
                className="w-full py-3 rounded-lg mt-2 bg-red-500 hover:bg-red-600"
                onClick={() => handleLeaveAuction()}
              >
                Leave Auction
              </PrimaryButton>

              {!user && (
                <Caption className="text-gray-600 mt-3 block">
                  Please log in as a bidder to place bids.
                </Caption>
              )}
              {(!canBidStatus || isOver) && (
                <Caption className="text-gray-600 mt-3 block">
                  Auction is not open for bidding.
                </Caption>
              )}
              {isAdmin && (
                <Caption className="text-gray-600 mt-3 block">
                  Admins cannot bid on any auction.
                </Caption>
              )}
              {isSeller && (
                <Caption className="text-gray-600 mt-3 block">
                  Sellers cannot bid on any auctions.
                </Caption>
              )}
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-6">
          <AuctionCommentSection auctionId={auctionId} highlightCommentId={highlightCommentId} />
        </div>
      </Container>
      <AuctionWinnerPopup
        isOpen={showWinnerPopup}
        onClose={() => setShowWinnerPopup(false)}
        price={formatMoney(auction.currentPrice)}
      />
    </Layout>
  );
};

export default AuctionDetail;
