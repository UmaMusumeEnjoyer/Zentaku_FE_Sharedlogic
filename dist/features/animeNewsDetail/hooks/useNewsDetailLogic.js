import { newsData } from '../constants/newsData'; // Đảm bảo đường dẫn import đúng
export const useNewsDetailLogic = (id) => {
    // Logic nghiệp vụ: Tìm tin tức dựa trên ID
    const newsItem = newsData.find(news => news.id.toString() === id);
    // Xử lý dữ liệu thô (nếu cần): Tách nội dung thành các đoạn văn bản
    // Việc này giúp UI chỉ cần render mảng paragraphs mà không cần logic split string
    const contentParagraphs = newsItem
        ? newsItem.fullContent.split('\n').filter(line => line.trim().length > 0)
        : [];
    return {
        newsItem,
        id,
        contentParagraphs,
        isNotFound: !newsItem, // Cờ trạng thái để UI dễ dàng kiểm tra
    };
};
//# sourceMappingURL=useNewsDetailLogic.js.map