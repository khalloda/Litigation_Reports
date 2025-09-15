import React, { useState, useEffect } from 'react'
import { Table, Pagination, Spinner, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useRTL } from '@hooks/useRTL'
import { useLanguage } from '@hooks/useLanguage'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import clsx from 'clsx'

interface Column<T> {
  key: string
  header: string
  headerAr?: string
  accessor: (item: T) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface ServerPaginatedTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: string
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  className?: string
  emptyMessage?: string
  emptyMessageAr?: string
}

export function ServerPaginatedTable<T>({
  columns,
  data,
  loading = false,
  error,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onSort,
  sortColumn,
  sortDirection,
  className,
  emptyMessage = 'No data available',
  emptyMessageAr = 'لا توجد بيانات متاحة'
}: ServerPaginatedTableProps<T>) {
  const { t } = useTranslation()
  const { isRTL } = useRTL()
  const { currentLanguage } = useLanguage()
  const [sortState, setSortState] = useState<{
    column: string | null
    direction: 'asc' | 'desc'
  }>({
    column: sortColumn || null,
    direction: sortDirection || 'asc'
  })

  const handleSort = (columnKey: string) => {
    if (!onSort) return

    const newDirection = 
      sortState.column === columnKey && sortState.direction === 'asc' 
        ? 'desc' 
        : 'asc'

    setSortState({ column: columnKey, direction: newDirection })
    onSort(columnKey, newDirection)
  }

  const renderPagination = () => {
    const items = []
    const maxVisiblePages = 5

    // Calculate visible page range
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key={1}
          active={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </Pagination.Item>
      )

      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />)
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />)
      }

      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      )
    }

    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className="pagination-info">
          <small className="text-muted">
            {currentLanguage === 'ar' 
              ? `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${Math.min(currentPage * itemsPerPage, totalItems)} من ${totalItems} عنصر`
              : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`
            }
          </small>
        </div>

        <Pagination 
          dir={isRTL ? 'rtl' : 'ltr'}
          className={clsx('mb-0', isRTL && 'pagination-rtl')}
        >
          <Pagination.First 
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            aria-label={currentLanguage === 'ar' ? 'الصفحة الأولى' : 'First page'}
          >
            {isRTL ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </Pagination.First>

          <Pagination.Prev 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label={currentLanguage === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Pagination.Prev>

          {items}

          <Pagination.Next 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label={currentLanguage === 'ar' ? 'الصفحة التالية' : 'Next page'}
          >
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Pagination.Next>

          <Pagination.Last 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label={currentLanguage === 'ar' ? 'الصفحة الأخيرة' : 'Last page'}
          >
            {isRTL ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </Pagination.Last>
        </Pagination>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">
            {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    )
  }

  if (data.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        {currentLanguage === 'ar' ? emptyMessageAr : emptyMessage}
      </Alert>
    )
  }

  return (
    <div className={clsx('server-paginated-table', className)}>
      <Table 
        responsive 
        striped 
        hover 
        className="mb-0"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <thead className="table-dark">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={clsx(
                  column.sortable && 'sortable',
                  column.align && `text-${column.align}`,
                  sortState.column === column.key && 'sorted'
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
                tabIndex={column.sortable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (column.sortable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    handleSort(column.key)
                  }
                }}
                aria-sort={
                  column.sortable 
                    ? sortState.column === column.key 
                      ? sortState.direction === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                    : undefined
                }
                role={column.sortable ? 'button' : undefined}
                aria-label={
                  column.sortable 
                    ? `${currentLanguage === 'ar' ? column.headerAr || column.header : column.header} - ${currentLanguage === 'ar' ? 'اضغط للترتيب' : 'Click to sort'}`
                    : undefined
                }
              >
                <div className="d-flex align-items-center">
                  <span>
                    {currentLanguage === 'ar' ? column.headerAr || column.header : column.header}
                  </span>
                  
                  {column.sortable && (
                    <span className="ms-2">
                      {sortState.column === column.key && (
                        <span className="sort-indicator">
                          {sortState.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={column.align ? `text-${column.align}` : undefined}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {column.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="table-pagination mt-3">
          {renderPagination()}
        </div>
      )}
    </div>
  )
}
