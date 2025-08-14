import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../contexts/WalletContext';
import qrCodeImage from '../../assets/images/qrcode.png';

const AddFunds = () => {
  const navigate = useNavigate();
  const { addFunds, loading } = useWallet();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);

  const presetAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000];

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  const handlePresetClick = (presetAmount) => {
    setAmount(presetAmount.toString());
  };

  const generatePaymentInfo = () => {
    if (!amount || parseInt(amount) < 100000) {
      alert('Số tiền tối thiểu là 100,000 VND');
      return;
    }

    if (parseInt(amount) > 100000000) {
      alert('Số tiền tối đa là 100,000,000 VND');
      return;
    }

    const paymentInfo = {
      bankCode: 'MB',
      accountNumber: '0123456789',
      accountName: 'AUCTION HOUSE',
      amount: parseInt(amount),
      transferContent: `NAP TIEN ${Date.now()}`,
      transferCode: `NAP${Date.now().toString().slice(-6)}`
    };

    setBankInfo(paymentInfo);
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    try {
      await addFunds(
        parseInt(amount),
        description || `Nạp tiền ${formatVND(parseInt(amount))} VND`
      );
      navigate('/wallet');
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleBack = () => {
    if (showPayment) {
      setShowPayment(false);
    } else {
      navigate(-1);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã sao chép vào clipboard!');
    });
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Thông tin thanh toán</h1>
                <button
                  onClick={handleBack}
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
             <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 mb-6 text-center">
                <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                  {/* QR thật */}
                  <img
                    src={qrCodeImage}
                    alt="QR Code thanh toán"
                    className="w-48 h-48 mx-auto rounded-lg"
                    onError={(e) => {
                      // Fallback nếu không load được ảnh
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  {/* Fallback content */}
                  <div style={{ display: 'none' }} className="w-48 h-48 flex items-center justify-center text-center">
                    <div>
                      <svg className="w-16 h-16 mx-auto text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4m-6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
                      </svg>
                      <p className="text-blue-600 font-medium text-sm">QR Code</p>
                    </div>
                  </div>
                </div>
                <p className="text-blue-600 font-medium mt-4">Quét mã QR với ứng dụng Banking</p>
                <p className="text-sm text-blue-500 mt-2">Hoặc sử dụng thông tin chuyển khoản bên dưới</p>
              </div>

              {/* Bank Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Thông tin chuyển khoản
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <div>
                      <span className="text-sm text-gray-600">Ngân hàng:</span>
                      <p className="font-medium">MB Bank</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard('MB Bank')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <div>
                      <span className="text-sm text-gray-600">Số tài khoản:</span>
                      <p className="font-medium font-mono">{bankInfo.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankInfo.accountNumber)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <div>
                      <span className="text-sm text-gray-600">Chủ tài khoản:</span>
                      <p className="font-medium">{bankInfo.accountName}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankInfo.accountName)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-yellow-50 p-3 rounded border border-yellow-200">
                    <div>
                      <span className="text-sm text-gray-600">Số tiền:</span>
                      <p className="font-bold text-lg text-red-600">{formatVND(parseInt(amount))} ₫</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(amount)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <div>
                      <span className="text-sm text-gray-600">Nội dung CK:</span>
                      <p className="font-medium font-mono text-sm">{bankInfo.transferContent}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bankInfo.transferContent)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hướng dẫn thanh toán
                </h4>
                <ol className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    Mở ứng dụng Banking hoặc Internet Banking
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    Chọn "Chuyển khoản" hoặc "Quét QR"
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    Nhập thông tin chuyển khoản phía trên
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    <strong>Quan trọng: Nhập đúng nội dung chuyển khoản</strong>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">5</span>
                    Xác nhận và thực hiện chuyển khoản
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">6</span>
                    Nhấn "Xác nhận thanh toán" bên dưới
                  </li>
                </ol>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.987-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Lưu ý quan trọng</h4>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Vui lòng chuyển khoản <strong>chính xác số tiền</strong></li>
                      <li>• <strong>Bắt buộc</strong> nhập đúng nội dung chuyển khoản</li>
                      <li>• Tiền sẽ được cộng vào ví trong vòng 5-10 phút</li>
                      <li>• Liên hệ hỗ trợ nếu không nhận được tiền sau 30 phút</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Nạp tiền vào ví</h1>
              <button
                onClick={handleBack}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Số tiền nạp *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount ? formatVND(parseInt(amount)) : ''}
                  onChange={handleAmountChange}
                  placeholder="Nhập số tiền"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-lg font-semibold"
                />
                <span className="absolute right-3 top-3 text-gray-500 font-medium">₫</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tối thiểu: 100,000 ₫ - Tối đa: 100,000,000 ₫
              </p>
            </div>

            {/* Preset Amounts */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Chọn nhanh
              </label>
              <div className="grid grid-cols-2 gap-3">
                {presetAmounts.map((presetAmount) => (
                  <button
                    key={presetAmount}
                    onClick={() => handlePresetClick(presetAmount)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      parseInt(amount) === presetAmount
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {formatVND(presetAmount)} ₫
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập ghi chú nếu có..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Generate Payment Info Button */}
            <button
              onClick={generatePaymentInfo}
              disabled={!amount || parseInt(amount) < 10000}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              Tạo thông tin thanh toán
            </button>

            {/* Security Note */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-green-800">Bảo mật</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Giao dịch được bảo mật bằng mã hóa SSL. Tiền sẽ được cộng vào ví ngay sau khi xác nhận thành công.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
