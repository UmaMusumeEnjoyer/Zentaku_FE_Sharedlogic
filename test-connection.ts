// test-connection.ts
import { initSharedLogic } from './src/core/config';
import { animeService } from './src/services/anime.service';

// 1. Giả lập Storage (Bắt buộc để initSharedLogic không lỗi)
const mockStorage = {
  getItem: (key: string) => {
    // console.log(`[Cache Read] ${key}`); // Bỏ comment nếu muốn debug cache
    return null;
  },
  setItem: (key: string, value: string) => {
    // console.log(`[Cache Write] ${key}`); // Bỏ comment nếu muốn debug cache
  },
  removeItem: (key: string) => console.log(`[Cache Delete] ${key}`)
};

// 2. Khởi tạo Shared Logic
console.log("🔄 Đang khởi tạo Shared Logic...");
initSharedLogic({
  storage: mockStorage,
  apiBaseUrl: 'https://doannguyen.pythonanywhere.com/api'
});

// 3. Hàm chạy thử nghiệm
const runTest = async () => {
  const TEST_ID = 183385; // ID 21 thường là One Piece trong database Anilist

  try {
    console.log(`\n📡 --- TEST: Gọi API lấy chi tiết Anime ID: ${TEST_ID} ---`);
    
    // Gọi hàm getById mà bạn vừa viết
    const response = await animeService.getById(TEST_ID);
    
    if (response && response.data) {
      console.log("✅ KẾT NỐI THÀNH CÔNG!");
      
      // In ra một vài thông tin quan trọng để kiểm chứng
      // Lưu ý: Cấu trúc data phụ thuộc vào API của bạn trả về cái gì
      // Dưới đây là mình log thử toàn bộ data để bạn soi structure
      console.log("📦 Dữ liệu trả về:");
      console.dir(response.data, { depth: 2, colors: true }); 

    } else {
      console.warn("⚠️ Server trả về 200 OK nhưng không có dữ liệu (data is empty)");
    }

  } catch (error: any) {
    console.error("\n❌ GỌI API THẤT BẠI!");
    
    if (error.response) {
      // Server trả về lỗi (404 Not Found, 500 Internal Server Error...)
      console.error(`Status Code: ${error.response.status}`);
      console.error("Message:", error.response.data);
      
      if (error.response.status === 404) {
        console.error("👉 Nguyên nhân: ID Anime này không tồn tại trong Database.");
      }
    } else if (error.request) {
      // Không gửi được request đi
      console.error("Lỗi mạng hoặc Server đang tắt.");
    } else {
      console.error("Lỗi code:", error.message);
    }
  }
};

// Chạy hàm test
runTest();