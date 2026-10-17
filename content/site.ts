/**
 * All site copy and data, in English and Vietnamese.
 *
 * Layout never imports raw strings — components read `t.*` from the
 * LanguageProvider so switching locale swaps every label at once.
 *
 * HONESTY RULES
 *   - Nothing here is invented. Facts the owner has not supplied yet are
 *     `null` (with an explicit `ph` placeholder string next to them).
 *   - The UI renders a placeholder as a visibly pending token, never as a
 *     square-fill guess. Replace the nulls in this file to activate content.
 *   - Names and domains (Khanh; student; C++, competitive programming, AI)
 *     come from the owner's earlier brief and are the only seeded facts.
 */

export type Locale = "en" | "vi"
export type SkillTier = "focus" | "building" | "exploring"

export type LinkItem = {
  name: string
  /** Real URL, or null until the owner supplies one. */
  href: string | null
  /** Visible placeholder shown while `href` is null. */
  ph: string
}

const en = {
  meta: {
    title: "Khanh — Portfolio",
    description:
      "Portfolio of Khanh: C++, competitive programming, small software, and AI experiments. [ description pending ]",
  },

  ui: {
    skipToContent: "Skip to content",
    langSwitchAria: "Switch to Vietnamese",
    themeToggleAria: "Toggle dark or light theme",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    copyEmail: "Copy email",
    copied: "Copied",
    templateStamp: "[ empty slot — content pending ]",
    pending: "[ pending ]",
  },

  person: {
    name: "Khanh",
    /** Footer wordmark; the shutter glyph alphabet only covers A–Z. */
    nameAscii: "KHANH",
    role: "Student developer",
    eyebrow: "C++ · competitive programming · AI",
    lede: "I write C++, spend a lot of time on competitive programming, and run small software and AI experiments on the side.",
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    ctaPrimary: { label: "Get in touch", href: "#contact" },
    ctaSecondary: { label: "About me", href: "#about" },
    hint: "Tap anywhere — every ping is yours.",
  },

  about: {
    index: "01",
    title: "About",
    paragraphs: [
      "I am a student developer. Most of what I know I learned by breaking things first and reading the error message carefully.",
      "Competitive programming is where I put in deliberate practice: a problem, a time limit, and a wrong answer that tells me exactly which assumption failed. C++ is what I reach for when the constraints are tight.",
      "Outside of contests I build smaller tools and run AI experiments to see how models actually behave, not how they are described.",
    ],
    facts: [
      { name: "Location", value: null as string | null, ph: "[ city, country ]" },
      { name: "Status", value: null as string | null, ph: "[ e.g. open to internships ]" },
    ],
  },

  skills: {
    index: "02",
    title: "Skills",
    note: "Levels are my own read of where my time goes, not a ranking.",
    tiers: {
      focus: { label: "Focus", level: 4 },
      building: { label: "Building", level: 3 },
      exploring: { label: "Exploring", level: 2 },
    },
    rows: [
      {
        name: "C++",
        detail: "The language I use for anything with a time limit: standard library, pointers, and the parts that surprise you.",
        tier: "focus" as SkillTier,
      },
      {
        name: "Data structures and algorithms",
        detail: "Graphs, dynamic programming, and the habit of proving a solution before trusting it.",
        tier: "focus" as SkillTier,
      },
      {
        name: "Competitive programming",
        detail: "Reading constraints, choosing the algorithm, stress testing the result.",
        tier: "focus" as SkillTier,
      },
      {
        name: "Software development",
        detail: "Small tools and interfaces, version controlled and built to be read later.",
        tier: "building" as SkillTier,
      },
      {
        name: "AI experiments",
        detail: "Small tests to see where models break and where a result actually came from.",
        tier: "exploring" as SkillTier,
      },
    ],
  },

  experience: {
    index: "03",
    title: "Experience",
    note: "Education, internships, and results land here as they happen. The rows below are empty slots on purpose.",
    items: [
      {
        id: "slot-a",
        year: null as string | null,
        yearPh: "[ year ]",
        title: null as string | null,
        titlePh: "[ role or degree ]",
        org: null as string | null,
        orgPh: "[ school or workplace ]",
        detail: null as string | null,
        detailPh: "[ one or two sentences about what you did and what it taught you ]",
      },
      {
        id: "slot-b",
        year: null as string | null,
        yearPh: "[ year ]",
        title: null as string | null,
        titlePh: "[ role or degree ]",
        org: null as string | null,
        orgPh: "[ school or workplace ]",
        detail: null as string | null,
        detailPh: "[ one or two sentences about what you did and what it taught you ]",
      },
    ],
  },

  contact: {
    index: "04",
    title: "Contact",
    lede: "The quickest way to reach me is email. I read everything. Ask me about the problems I have worked through.",
    email: null as string | null,
    emailPh: "[ email address ]",
    links: [
      { name: "GitHub", href: null, ph: "[ GitHub URL ]" },
      { name: "LinkedIn", href: null, ph: "[ LinkedIn URL ]" },
      { name: "Facebook", href: null, ph: "[ Facebook URL ]" },
      { name: "Discord", href: null, ph: "[ Discord handle ]" },
      { name: "Codeforces", href: null, ph: "[ Codeforces URL ]" },
      { name: "LeetCode", href: null, ph: "[ LeetCode URL ]" },
    ],
  },

  footer: {
    since: 2026,
    company: "Khanh",
    cta: {
      lede: "Building something, or want to talk competitive programming?",
      linkLabel: "Write me a line",
      href: "#contact",
    },
    socials: [
      { name: "GitHub", href: null, ph: "[ GitHub URL ]" },
      { name: "LinkedIn", href: null, ph: "[ LinkedIn URL ]" },
      { name: "Discord", href: null, ph: "[ Discord handle ]" },
    ],
    legal: [] as { name: string; href: string | null; ph: string }[],
  },
} 

export type Content = typeof en

const vi: Content = {
  meta: {
    title: "Khanh — Portfolio",
    description:
      "Portfolio của Khanh: C++, lập trình thi đấu, phần mềm nhỏ và các thí nghiệm AI. [ mô tả đang chờ ]",
  },

  ui: {
    skipToContent: "Tới nội dung chính",
    langSwitchAria: "Chuyển sang tiếng Anh",
    themeToggleAria: "Đổi giao diện sáng/tối",
    menuOpen: "Mở menu",
    menuClose: "Đóng menu",
    copyEmail: "Sao chép email",
    copied: "Đã sao chép",
    templateStamp: "[ ô trống — nội dung đang chờ ]",
    pending: "[ đang chờ ]",
  },

  person: {
    name: "Khanh",
    nameAscii: "KHANH",
    role: "Sinh viên lập trình",
    eyebrow: "C++ · lập trình thi đấu · AI",
    lede: "Tôi viết C++, dành nhiều thời gian cho lập trình thi đấu, và xây dựng các phần mềm nhỏ cùng những thí nghiệm AI.",
  },

  nav: [
    { label: "Giới thiệu", href: "#about" },
    { label: "Kỹ năng", href: "#skills" },
    { label: "Hành trình", href: "#experience" },
    { label: "Liên hệ", href: "#contact" },
  ],

  hero: {
    ctaPrimary: { label: "Liên hệ ngay", href: "#contact" },
    ctaSecondary: { label: "Về tôi", href: "#about" },
    hint: "Chạm bất cứ đâu — mỗi sóng sonar là của bạn.",
  },

  about: {
    index: "01",
    title: "Giới thiệu",
    paragraphs: [
      "Tôi là sinh viên ngành lập trình. Phần lớn những gì tôi biết đến từ việc phá hỏng mọi thứ trước, rồi đọc kỹ thông báo lỗi.",
      "Lập trình thi đấu là nơi tôi rèn luyện có chủ đích: một bài toán, một giới hạn thời gian, và một verdict sai để chỉ ra chính xác giả định nào đã thất bại. C++ là thứ tôi chọn khi điều kiện bài toán gắt gao.",
      "Ngoài các kỳ thi, tôi xây dựng vài công cụ nhỏ và chạy thí nghiệm AI để xem các mô hình thực hành ra sao, chứ không phải như người ta mô tả.",
    ],
    facts: [
      { name: "Nơi ở", value: null, ph: "[ thành phố, quốc gia ]" },
      { name: "Tình trạng", value: null, ph: "[ ví dụ: sẵn sàng nhận internship ]" },
    ],
  },

  skills: {
    index: "02",
    title: "Kỹ năng",
    note: "Mức độ là cách tôi tự đánh giá thời gian mình bỏ ra, không phải bảng xếp hạng.",
    tiers: {
      focus: { label: "Trọng tâm", level: 4 },
      building: { label: "Đang xây", level: 3 },
      exploring: { label: "Khám phá", level: 2 },
    },
    rows: [
      {
        name: "C++",
        detail: "Ngôn ngữ tôi dùng cho mọi bài có giới hạn thời gian: thư viện chuẩn, con trỏ, và những cú bẫy bất ngờ.",
        tier: "focus",
      },
      {
        name: "Cấu trúc dữ liệu và thuật toán",
        detail: "Đồ thị, động quy, và thói quen chứng minh lời giải trước khi tin vào nó.",
        tier: "focus",
      },
      {
        name: "Lập trình thi đấu",
        detail: "Đọc điều kiện bài, chọn thuật toán, và stress test kết quả.",
        tier: "focus",
      },
      {
        name: "Phát triển phần mềm",
        detail: "Công cụ nhỏ và giao diện, version control đầy đủ, viết để đọc lại được sau này.",
        tier: "building",
      },
      {
        name: "Thí nghiệm AI",
        detail: "Các thử nghiệm nhỏ để xem mô hình gãy ở đâu, và kết quả thực sự đến từ đâu.",
        tier: "exploring",
      },
    ],
  },

  experience: {
    index: "03",
    title: "Hành trình",
    note: "Học vấn, internship và kết quả sẽ được ghi lại khi có thật. Các dòng dưới đây là ô trống, để lộ danh tính trung thực.",
    items: [
      {
        id: "slot-a",
        year: null,
        yearPh: "[ năm ]",
        title: null,
        titlePh: "[ vai trò hoặc bằng cấp ]",
        org: null,
        orgPh: "[ trường hoặc nơi làm việc ]",
        detail: null,
        detailPh: "[ một hai câu về những gì bạn đã làm và học được ]",
      },
      {
        id: "slot-b",
        year: null,
        yearPh: "[ năm ]",
        title: null,
        titlePh: "[ vai trò hoặc bằng cấp ]",
        org: null,
        orgPh: "[ trường hoặc nơi làm việc ]",
        detail: null,
        detailPh: "[ một hai câu về những gì bạn đã làm và học được ]",
      },
    ],
  },

  contact: {
    index: "04",
    title: "Liên hệ",
    lede: "Nhanh nhất là email. Tôi đọc tất cả. Bạn có thể hỏi về những bài tôi đã luyện qua.",
    email: null as string | null,
    emailPh: "[ địa chỉ email ]",
    links: [
      { name: "GitHub", href: null, ph: "[ GitHub URL ]" },
      { name: "LinkedIn", href: null, ph: "[ LinkedIn URL ]" },
      { name: "Facebook", href: null, ph: "[ Facebook URL ]" },
      { name: "Discord", href: null, ph: "[ Discord handle ]" },
      { name: "Codeforces", href: null, ph: "[ Codeforces URL ]" },
      { name: "LeetCode", href: null, ph: "[ LeetCode URL ]" },
    ],
  },

  footer: {
    since: 2026,
    company: "Khanh",
    cta: {
      lede: "Đang xây gì đó, hay muốn chém gió về lập trình thi đấu?",
      linkLabel: "Nhắn cho tôi một dòng",
      href: "#contact",
    },
    socials: [
      { name: "GitHub", href: null, ph: "[ GitHub URL ]" },
      { name: "LinkedIn", href: null, ph: "[ LinkedIn URL ]" },
      { name: "Discord", href: null, ph: "[ Discord handle ]" },
    ],
    legal: [] as { name: string; href: string | null; ph: string }[],
  },
}

export const site: Record<Locale, Content> = { en, vi }
