import type { SiteContent } from "../site";

/**
 * Vietnamese copy. This is the source of truth for tone — keep the English
 * file aligned with it. Replace bracketed values with your real info.
 */
export const vi: SiteContent = {
  docTitle: "Khánh · Sinh viên, Lập trình viên, Người sáng tạo",
  docDescription:
    "Trang cá nhân của Khánh: sinh viên, lập trình viên, người sáng tạo. Dự án, sở thích, và hành trình đến hiện tại.",
  person: {
    name: "Khánh",
    role: "Sinh viên · Lập trình viên · Người sáng tạo",
    tagline: "Tò mò với công nghệ. Thích tạo ra thứ gì đó.",
    intro:
      "Mình thích khám phá ý tưởng, giải quyết vấn đề, và biến những gì học được thành dự án thật.",
  },
  nav: [
    { label: "Giới thiệu", href: "#about" },
    { label: "Dự án", href: "#projects" },
    { label: "Kỹ năng", href: "#skills" },
    { label: "Hành trình", href: "#journey" },
    { label: "Liên hệ", href: "#contact" },
  ],
  about: {
    lead: "Mình là sinh viên yêu thích lập trình, công nghệ và thử nghiệm sáng tạo. Mình học bằng cách xây dựng — và xem một ý tưởng hoạt động thế nào trong thực tế.",
    body: [
      "Phần lớn những gì mình biết đến từ việc bóc một thứ ra rồi lắp nó lại. Một buổi học giới thiệu ý tưởng, một dự án buộc mình phải hiểu nó.",
      "Hiện tại mình đang học cách làm phần mềm dùng thấy dễ chịu, không chỉ chạy được. Nghĩa là rất nhiều thử nghiệm nhỏ: một game engine viết trong dịp cuối tuần, một công cụ mình cần lúc 2 giờ sáng, một mô phỏng cho thứ mình đang thắc mắc.",
    ],
    learning:
      "Đang học: làm game và cách mô hình machine learning thực sự vận hành bên trong.",
  },
  projects: [
    {
      name: "[Tên dự án]",
      year: "[Năm]",
      summary: "Mô tả ngắn dự án này làm gì và vấn đề nó khám phá.",
      detail:
        "Văn bản mẫu. Thay bằng hai ba câu: dự án làm gì, khám phá vấn đề gì, và được xây ra sao. Điều gì khó, mình học được gì, và nếu làm lại mình sẽ thay đổi gì.",
      stack: ["[Công nghệ]", "[Công nghệ]", "[Công nghệ]"],
      githubUrl: "[GitHub URL]",
      demoUrl: "[Live Demo URL]",
      featured: true,
      image: null,
      imageCaption: "Đặt [ảnh chụp màn hình dự án] vào đây",
    },
    {
      name: "[Tên dự án]",
      year: "[Năm]",
      summary:
        "Một ví dụ khác. Một công cụ, một trò chơi, một thử nghiệm: bất cứ gì bạn thực sự đã làm.",
      detail:
        "Văn bản mẫu. Mô tả dự án thứ hai theo cách tương tự: ý tưởng đằng sau nó, cách nó hoạt động, và bạn rút ra điều gì khi xây nó.",
      stack: ["[Công nghệ]", "[Công nghệ]"],
      githubUrl: "[GitHub URL]",
      demoUrl: "[Live Demo URL]",
      featured: false,
      image: null,
      imageCaption: "Đặt [ảnh chụp màn hình dự án] vào đây",
    },
    {
      name: "[Tên dự án]",
      year: "[Năm]",
      summary:
        "Chỗ thứ ba để trang trông hoàn chỉnh trước khi dự án thật của bạn được thêm vào.",
      detail:
        "Văn bản mẫu. Dùng mục này cho một thử nghiệm nhỏ hoặc bài tập trên lớp. Ngắn và thật thà hơn dài và hào nhoáng.",
      stack: ["[Công nghệ]", "[Công nghệ]"],
      githubUrl: "[GitHub URL]",
      demoUrl: "",
      featured: false,
      image: null,
      imageCaption: "Đặt [ảnh chụp màn hình dự án] vào đây",
    },
  ],
  interests: [
    {
      name: "Lập trình",
      note: "Viết vài công cụ nhỏ và xem chúng sẽ đi đến đâu.",
    },
    {
      name: "Lập trình thi đấu",
      note: "Những bài toán có giới hạn thời gian và một đáp án đúng rõ ràng.",
    },
    {
      name: "Thử nghiệm AI",
      note: "Chọc vào mô hình để xem nó hành xử thế nào, không chỉ nghe nó nói.",
    },
    {
      name: "Minecraft",
      note: "Redstone là lập trình với một font chữ khác.",
    },
    {
      name: "Dự án sáng tạo",
      note: "Bất cứ gì nằm ở khe nối giữa code và design.",
    },
  ],
  skillGroups: [
    {
      group: "Ngôn ngữ",
      items: ["C++", "Python", "JavaScript", "TypeScript"],
    },
    {
      group: "Web",
      items: ["React", "HTML", "CSS", "Vite"],
    },
    {
      group: "Công cụ",
      items: ["Git", "VS Code", "Linux (WSL)"],
    },
  ],
  journey: [
    {
      period: "[Năm]",
      title: "[Dòng code đầu tiên]",
      text: "Văn bản mẫu. Viết về khoảnh khắc bạn bị cuốn hút: chương trình đầu tiên chạy được, bản mod game đầu tiên hoạt động, bài toán đầu tiên bạn tự giải.",
    },
    {
      period: "[Năm]",
      title: "[Một dự án hoặc kỳ thi đáng nhớ]",
      text: "Văn bản mẫu. Một hai câu về điều bạn đã làm và vì sao nó có ý nghĩa với bạn, không phải nhìn như CV.",
    },
    {
      period: "[Hiện tại]",
      title: "[Bạn đang hướng tới đâu]",
      text: "Văn bản mẫu. Bạn đang học gì và muốn xây gì tiếp theo. Dòng này được phép chưa chắc chắn.",
    },
  ],
  contact: {
    heading: "Nói hello nhé",
    text: "Sẵn sàng cho dự án, hợp tác, và một cuộc trò chuyện hay về bất cứ gì liên quan đến kỹ thuật.",
    email: "[Email của bạn]",
    links: [
      { label: "GitHub", value: "[GitHub URL]" },
      { label: "Discord", value: "[Discord handle]" },
    ],
  },
  footer: {
    note: "Tự tay làm nên. Nội dung nằm trong src/content/lang/vi.ts và en.ts.",
  },
  ui: {
    skipToContent: "Chuyển đến nội dung",
    mainNav: "Điều hướng chính",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    seeProjects: "Xem dự án",
    contactCta: "Liên hệ",
    backToTop: "Về đầu trang",
    aboutTitle: "Giới thiệu",
    projectsTitle: "Dự án",
    projectsSub:
      "Các mục mẫu bên dưới, còn trong ngoặc vuông cho đến khi có bài thật. Mỗi mục là một chỗ để điền, không phải một tuyên bố.",
    interestsTitle: "Những thứ mình dành thời gian cho",
    skillsTitle: "Công cụ mình dùng",
    skillsSub:
      "Một danh sách, không phải biểu đồ. Thứ tự trong một nhóm không nói gì ngoài việc đọc thấy thuận hơn.",
    journeyTitle: "Hành trình đến hiện tại",
    journeySub:
      "Những cột mốc mẫu. Mọi mốc thời gian và sự kiện ở đây đều thuộc về bạn.",
    technologies: "Công nghệ",
    code: "Mã nguồn",
    liveDemo: "Bản demo",
    emailLabel: "Email",
    screenshotAlt: "Ảnh chụp màn hình của {name}",
    pendingUrlHint: "Thêm URL thật trong src/content/lang (vi.ts / en.ts)",
    pendingEmailHint: "Thêm email thật trong src/content/lang (vi.ts / en.ts)",
    portraitPlaceholder: "[Ảnh của bạn]",
    portraitNoteBefore: "Đặt một tấm ảnh tại ",
    portraitNotePath: "public/images/portrait.jpg",
    portraitNoteAfter:
      " và trỏ component Hero vào nó. Cho tới lúc đó, khung này vẫn thành thật.",
    darkMode: "Chế độ tối",
    lightMode: "Chế độ sáng",
    switchLanguage: "Chuyển ngôn ngữ",
  },
};
