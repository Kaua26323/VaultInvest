import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./navigationBar.module.css";

interface NavigationBarProps {
  changePage: (page: number) => void;
  currentPage: number;
  disabled: boolean;
  isLastPage: boolean;
}

export function NavigationBar({
  changePage,
  disabled,
  isLastPage,
  currentPage,
}: NavigationBarProps) {
  const startPage = Math.max(1, currentPage - 2);
  const dynamicPages = Array.from(
    { length: 10 },
    (_, index) => startPage + index,
  );

  function previusPage() {
    if (currentPage > 1) return changePage(currentPage - 1);
  }

  function nextPage() {
    if (!isLastPage) return changePage(currentPage + 1);
  }

  return (
    <div className={styles.navigationBox}>
      <button
        aria-label="previous page"
        onClick={previusPage}
        disabled={disabled || currentPage === 1}
      >
        <ChevronLeft size={40} color="#fff" />
      </button>
      <div className={styles.pagesArea}>
        {dynamicPages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => changePage(pageNumber)}
            className={`${pageNumber === currentPage ? styles.active : ""}`}
            disabled={disabled || (isLastPage && pageNumber > currentPage)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        aria-label="next page"
        onClick={nextPage}
        disabled={disabled || isLastPage}
      >
        <ChevronRight size={40} color="#fff" />
      </button>
    </div>
  );
}
