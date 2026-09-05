export const BRAND_NAME = "Con Cưng";
export const BRAND_TAGLINE = "Hệ thống Siêu thị Mẹ và Bé lớn nhất Việt Nam";
export const HOTLINE_PURCHASE = "1800 6609";
export const HOTLINE_CUSTOMER_CARE = "1800 6609";
export const WORKING_HOURS = "08:00 - 22:00 hàng ngày";

export interface CategoryNavItem {
  name: string;
  href: string;
  slug: string;
  isHot?: boolean;
  hasMegaMenu?: boolean;
  megaMenuData?: {
    columns: {
      title: string;
      items: { name: string; href: string }[];
    }[];
    featuredBrand?: string[];
  };
}

export const MAIN_NAV_ITEMS: CategoryNavItem[] = [
  {
    name: "Sữa",
    href: "/category/sua-thuc-pham",
    slug: "sua-thuc-pham",
    hasMegaMenu: true,
    megaMenuData: {
      columns: [
        {
          title: "Sữa Theo Độ Tuổi",
          items: [
            { name: "Sữa cho bé 0 - 6 tháng", href: "/category/sua-thuc-pham?age=0-6" },
            { name: "Sữa cho bé 6 - 12 tháng", href: "/category/sua-thuc-pham?age=6-12" },
            { name: "Sữa cho bé 1 - 2 tuổi", href: "/category/sua-thuc-pham?age=1-2" },
            { name: "Sữa cho bé 2 tuổi trở lên", href: "/category/sua-thuc-pham?age=2plus" },
          ],
        },
        {
          title: "Loại Sữa Dinh Dưỡng",
          items: [
            { name: "Sữa công thức", href: "/category/sua-thuc-pham?type=cong-thuc" },
            { name: "Sữa pha sẵn tiện lợi", href: "/category/sua-thuc-pham?type=pha-san" },
            { name: "Sữa tươi & Sữa hạt", href: "/category/sua-thuc-pham?type=sua-tuoi" },
            { name: "Sữa phát triển chiều cao", href: "/category/sua-thuc-pham?type=chieu-cao" },
          ],
        },
        {
          title: "Thương Hiệu Nổi Tiếng",
          items: [
            { name: "Friso Gold (Hà Lan)", href: "/search?q=Friso" },
            { name: "Aptamil Essensis (Anh)", href: "/search?q=Aptamil" },
            { name: "Meiji (Nhật Bản)", href: "/search?q=Meiji" },
            { name: "Enfamil & Similac", href: "/search?q=Enfa" },
          ],
        },
      ],
    },
  },
  {
    name: "Bỉm & Tã",
    href: "/category/ta-bim",
    slug: "ta-bim",
    hasMegaMenu: true,
    megaMenuData: {
      columns: [
        {
          title: "Loại Tã Bỉm",
          items: [
            { name: "Tã dán sơ sinh", href: "/category/ta-bim?type=dan" },
            { name: "Tã quần cao cấp", href: "/category/ta-bim?type=quan" },
            { name: "Tã vải hữu cơ", href: "/category/ta-bim?type=vai" },
            { name: "Khăn ướt em bé", href: "/category/ta-bim?type=khan-uot" },
          ],
        },
        {
          title: "Kích Thước Size Tã",
          items: [
            { name: "Size NewBorn (< 5kg)", href: "/category/ta-bim?size=nb" },
            { name: "Size S (4 - 8kg)", href: "/category/ta-bim?size=s" },
            { name: "Size M (6 - 11kg)", href: "/category/ta-bim?size=m" },
            { name: "Size L (9 - 14kg)", href: "/category/ta-bim?size=l" },
            { name: "Size XL / XXL (12kg+)", href: "/category/ta-bim?size=xl" },
          ],
        },
        {
          title: "Thương Hiệu Tã Bỉm",
          items: [
            { name: "Moony Natural (Nhật Bản)", href: "/search?q=Moony" },
            { name: "Huggies Platinum", href: "/search?q=Huggies" },
            { name: "Bobby Extra Soft", href: "/search?q=Bobby" },
            { name: "Merries Nhật Bản", href: "/search?q=Merries" },
          ],
        },
      ],
    },
  },
  {
    name: "Ăn dặm",
    href: "/category/sua-thuc-pham",
    slug: "an-dam",
  },
  {
    name: "Đồ dùng Mẹ & Bé",
    href: "/category/xe-day-diu",
    slug: "do-dung-me-be",
    hasMegaMenu: true,
    megaMenuData: {
      columns: [
        {
          title: "Xe Đẩy & Địu Em Bé",
          items: [
            { name: "Xe đẩy gấp gọn du lịch", href: "/category/xe-day-diu" },
            { name: "Xe đẩy 2 chiều cao cấp", href: "/category/xe-day-diu" },
            { name: "Địu em bé 4 tư thế", href: "/category/xe-day-diu" },
            { name: "Ghế ô tô an toàn cho bé", href: "/category/xe-day-diu" },
          ],
        },
        {
          title: "Chăm Sóc Cho Mẹ Bầu",
          items: [
            { name: "Máy hút sữa rảnh tay Medela", href: "/category/cham-soc-me-bau" },
            { name: "Vitamin & TPCN Mẹ Bầu", href: "/category/cham-soc-me-bau" },
            { name: "Kem chống nứt ti & Dầu dừa", href: "/category/cham-soc-me-bau" },
            { name: "Gối ôm bà bầu cao cấp", href: "/category/cham-soc-me-bau" },
          ],
        },
        {
          title: "Đồ Dùng Cho Bé",
          items: [
            { name: "Bình sữa & Bún ti silicone", href: "/category/xe-day-diu" },
            { name: "Máy tiệt trùng & Hâm sữa", href: "/category/xe-day-diu" },
            { name: "Nước giặt xả em bé Dnee", href: "/search?q=Dnee" },
          ],
        },
      ],
    },
  },
  {
    name: "Thời trang",
    href: "/category/thoi-trang-tre-em",
    slug: "thoi-trang-tre-em",
  },
  {
    name: "Đồ chơi",
    href: "/category/do-choi-hoc-tap",
    slug: "do-choi-hoc-tap",
  },
  {
    name: "Chăm sóc bé",
    href: "/category/cham-soc-me-bau",
    slug: "cham-soc-be",
  },
  {
    name: "Khuyến mãi",
    href: "/category/ta-bim",
    slug: "khuyen-mai",
    isHot: true,
  },
];

export const POPULAR_SEARCH_TAGS = [
  "Sữa Aptamil",
  "Bỉm cho bé",
  "Sữa cho trẻ sơ sinh",
  "Bình sữa",
  "Xe đẩy",
  "Đồ chơi cho bé",
];
