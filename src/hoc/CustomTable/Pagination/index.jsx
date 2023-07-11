import React from 'react';
import { usePagination, DOTS } from '../../usePagination';

const Pagination = props =>{
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    if (currentPage === 0 || paginationRange?.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange?.length - 1];

    return (
        <ul
            className={`pagination-container ${className}`}
        >
            <li
                className={`${currentPage === 1? 'disabled' : ""} pagination-item`}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li>
            {paginationRange?.map((pageNumber,i) => {
                if (pageNumber === DOTS) {
                    return <li className="pagination-item dots">&#8230;</li>
                }
                return (
                    <li
                        key={i}
                        className={`pagination-item ${pageNumber === currentPage ? 'selected' : ""}`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            <li
                className={`pagination-item ${ currentPage === lastPage ? 'disabled' : ""}`}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
    );
};

export default Pagination;
