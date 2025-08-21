import { Routes, Route } from "react-router-dom";
import CreateAuction from "@/screens/auctions/CreateAuction/index.jsx";
import AuctionDetail from "@/screens/auctions/AuctionDetail/index.jsx";

export const AuctionRoutes = () => {
    return (
        <Routes>
            <Route path="create" element={<CreateAuction />} />
            <Route path=":auctionId" element={<AuctionDetail />} />
        </Routes>
    );
};
