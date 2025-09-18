## LazorKit Wallet – Tổng hợp thay đổi (3 trạng thái người dùng + hiển thị token)

### Mục tiêu
- Chuẩn hoá trải nghiệm cho 3 trạng thái người dùng (chưa có gì, có Passkey nhưng chưa có ví, đã có Passkey và đã có ví) thông qua `hasPasskey`, `hasWallet`.
- Cải thiện cách lấy/hiển thị dữ liệu token, tổng số dư, và trạng thái danh mục.
- Hoàn thiện luồng on-ramp/swap ở mức demo, chưa cần kết nối LazorKit thật.

### 1) Trạng thái và điều hướng
- `app/page.tsx`
  - Xác định 3 trạng thái dựa trên `hasPasskey`, `hasWallet`. Tạm thời hiển thị `OnRampScreen` cho mọi trạng thái (demo), và sẽ `redirect /buy` khi đã có ví.
  - Ghi chú rõ 3 trạng thái trong code để dễ mở rộng logic UI sau này.
- `components/onramp-screen.tsx`
  - Cung cấp stepper 3 bước (Passkey → Wallet → Buy) và hành động tương ứng:
    - Tạo Passkey: `setHasPasskey(true)` (mô phỏng delay).
    - Tạo Wallet: sinh `pubkey` giả (`generatePublicKey`) và `setHasWallet(true)`.
  - Khi đủ Passkey + Wallet thì hiển thị `OnRampForm`; kèm nhắc nhẹ nếu có ví nhưng chưa có tài sản (`hasAssets`).
- `components/onboarding-banner.tsx` (mới)
  - Banner gọn để tạo nhanh Passkey/Wallet ngay trong màn hình bất kỳ khi thiếu.

### 2) Hiển thị token, tổng số dư và danh mục
- `components/wallet-banner.tsx`
  - Tính `totalBalance` dựa trên giá hiệu dụng: lấy từ Jupiter (`usdPrice`) nếu có, fallback sang `token.priceUsd` nội bộ.
  - Hỗ trợ ẩn/hiện số dư, đổi đơn vị USD/VND theo `fiat` và `rateUsdToVnd`.
- `components/assets-tab.tsx`
  - Tải metadata token phổ biến từ Jupiter (`fetchCommonTokens`) để lấy icon, tên, giá USD.
  - Bổ sung bộ lọc ẩn token số dư 0, đếm số token khác 0, hiển thị trạng thái rỗng, retry khi lỗi tải metadata.
  - Dùng các selector mới từ store: `hasAssets`, `hasNoAssets`, `getNumNonZeroTokens`, `getVisibleTokens`.
- `components/assets-activity.tsx`
  - Hoạt động gần đây, khung loading nhẹ, format thời gian rõ ràng.
- `components/token-detail-modal.tsx`
  - Màn chi tiết token (giá, 24h change, sparkline demo, mint).

### 3) Luồng On-ramp và Swap (demo)
- `app/buy/page.tsx`
  - Nếu đã có ví: hiển thị `WalletBanner` + card có tab `Buy/Swap` (Jupiter-style) và render `OnRampForm`/`SwapForm` theo tab.
  - Nếu chưa có ví: hiển thị section hướng dẫn mua lần đầu + `OnRampForm` (đơn giản hoá).
  - Luôn fetch token metadata Jupiter một lần cho trang.
- `components/onramp-form.tsx`
  - Hỗ trợ chọn `USD/VND`, chuyển đổi theo tỉ giá cố định demo 27,000.
  - Chọn token (USDC/USDT), lấy icon/id từ Jupiter nếu có; hiển thị ước lượng nhận dựa trên `usdPrice`.
  - Quick amounts theo USD, validate min/max ($20–$500), mở `OnRampPreviewModal`.
- `components/onramp-preview-modal.tsx`
  - Tính breakdown phí demo và cho phép xác nhận thanh toán; callback đẩy về `/callback/success`.
- `components/swap-form.tsx`
  - Chọn token `from/to`, MAX/HALF, ước lượng nhận theo tỉ lệ giá (từ Jupiter hoặc fallback local), chọn slippage.
  - Mở `SwapReviewModal` và khi xác nhận sẽ gọi `swapFake` trong store, hiển thị toast.

### 4) Store: selectors và fake mutators
- `lib/store/wallet.ts`
  - Thêm và chuẩn hoá selectors: `getTokenAmount`, `getPortfolioValueUsd`, `hasAssets`, `hasNoAssets`, `getNumTokens`, `getNumNonZeroTokens`, `getTokenValueUsd`, `getEffectivePriceUsd`, `getVisibleTokens(hideZero)`.
  - Bổ sung mutators demo: `onrampFake`, `swapFake`, `sendFake`, `depositFake`, `addDevice`, `removeDevice`, `addActivity`, cùng `resetDemoData`.
  - Đồng bộ với ENV demo bằng `persist` + kiểm tra thay đổi môi trường để reset storage khi cần.

### 5) i18n và định dạng
- `lib/i18n/en.json`, `lib/i18n/vi.json`
  - Bổ sung nhiều key cho on-ramp/swap/wallet/assets, hỗ trợ UI mới.
- `lib/i18n/index.ts`
  - Hàm `t(key, params)` có fallback sang English khi thiếu key, kèm `setLanguage`/`getLanguage`.
- `lib/utils/format.ts`
  - Hàm tiện ích: `formatCurrency` (USD/VND), `formatCurrencyCompact`, `formatNumber`, `formatTokenAmount`, `formatPercentage`, `formatTiny`, `formatAddress`, `formatDate`, `formatRelativeTime`, `convertCurrency`, `validateAmount`, `generateOrderId`, `generatePublicKey`.

### 6) Màn tài khoản
- `app/account/page.tsx`
  - Banner tổng số dư tương tự `WalletBanner`, hành động nhanh (Send/Deposit), 3 tab `Assets/Devices/Settings`.

### 7) Danh sách file đã chỉnh sửa/được thêm
- app/layout.tsx
- app/page.tsx
- app/account/page.tsx
- app/buy/page.tsx
- components/assets-activity.tsx
- components/assets-tab.tsx
- components/onboarding-banner.tsx (mới)
- components/onramp-form.tsx
- components/onramp-preview-modal.tsx
- components/onramp-screen.tsx
- components/swap-form.tsx
- components/token-detail-modal.tsx
- components/wallet-banner.tsx
- lib/i18n/en.json
- lib/i18n/index.ts
- lib/i18n/vi.json
- lib/store/wallet.ts
- lib/utils/format.ts

### 8) Cách kiểm thử nhanh (manual QA)
1. Trạng thái 1 – Chưa có gì: đặt `hasPasskey=false`, `hasWallet=false` trong storage (hoặc `resetDemoData` và tắt demo). Vào `/` thấy step Passkey, nhấn tạo Passkey.
2. Trạng thái 2 – Có Passkey, chưa có ví: sau bước (1), nhấn tạo Wallet; sinh `pubkey`, hiển thị form on-ramp.
3. Trạng thái 3 – Có Passkey + Wallet: tự động điều hướng `/buy`; thấy `WalletBanner`, có thể Buy/Swap.
4. Kiểm tra Assets: toggle ẩn số dư/ẩn số 0, icon/tên/giá lấy từ Jupiter (fallback ok), đếm token > 0 đúng.
5. On-ramp: nhập số tiền, validate min/max, xem preview, xác nhận sẽ điều hướng `/callback/success` (demo).
6. Swap: chọn token, HALF/MAX, ước lượng nhận theo tỷ lệ giá, xác nhận gọi `swapFake` và cập nhật hoạt động.

### 9) Ghi chú
- Tất cả hành vi mua/hoán đổi đều là mô phỏng; không có kết nối mạng thực đến LazorKit hay on-ramp provider.
- Giá token ưu tiên từ Jupiter service (`lib/services/jupiter.ts`) và fallback sang dữ liệu mock local.

---
Các thay đổi trên giúp UI bám sát 3 trạng thái người dùng, số dư/tài sản hiển thị chính xác hơn, và luồng Buy/Swap mượt mà cho mục đích demo.


