"use client";
import React from "react";
import ReactPaginate from "react-paginate";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (selected: any) => void;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onChange}) => {
  return (
    <div className="cursor-pointer">
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <div className="pagination_head rounded-r-md">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        }
        onPageChange={(value) => onChange(value.selected + 1)}
        pageRangeDisplayed={1}
        marginPagesDisplayed={currentPage < 3 || currentPage > totalPages - 2 ? 2 : 1}
        pageCount={totalPages}
        previousLabel={
          <div className="pagination_head rounded-l-md">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        }
        containerClassName="inline-flex -space-x-px shadow-sm"
        pageClassName="pagination_body"
        breakClassName="pagination_body"
        activeClassName="bg-light dark:bg-dark"
        initialPage={currentPage - 1}
      />
    </div>
  );
};

export default Pagination;
