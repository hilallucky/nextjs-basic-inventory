import { sql } from "@vercel/postgres";
import { Product, Vendor } from "./definitions";

export const formatQuantity = (quantity: number) => {
  return (quantity / 100).toLocaleString();
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
    timeStyle: "short",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export async function generateReport(vendor: Vendor) {
  const products = await sql<Product>`
    SELECT * from products p
    JOIN vendor v ON v.id = p.vendor_id
    WHERE v.id = ${vendor.id}`

  const ExcelJS = require('exceljs');
  console.log("Generating vendor report...");
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet(`${vendor.name} Inventory Report`);

  sheet.columns = [
    { header: 'Product Name', key: 'name'},
    { header: 'Barcode', key: 'barcode'},
    { header: 'Name', key: 'quantity'},
    { header: 'Unit', key: 'unit'},
  ]

  let testObj = { name: 'heyo', age: '12'};
  console.log(testObj['name']);
  // products.rows.forEach((product) => {
  //   let rowIterator = 1;
  //   sheet.columns.forEach((column) => {
  //     let colIterator = 0;
  //     let curRow = sheet.getRow(rowIterator);
  //     curRow.getCell(colIterator).value = product.get(column);
  //   })
  // });
}
// export const generateYAxis = (revenue: Revenue[]) => {
//   // Calculate what labels we need to display on the y-axis
//   // based on highest record and in 1000s
//   const yAxisLabels = [];
//   const highestRecord = Math.max(...revenue.map((month) => month.revenue));
//   const topLabel = Math.ceil(highestRecord / 1000) * 1000;

//   for (let i = topLabel; i >= 0; i -= 1000) {
//     yAxisLabels.push(`$${i / 1000}K`);
//   }

//   return { yAxisLabels, topLabel };
// };

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const createDatabaseErrorMsg = (error: string) => {
  return `Database Error: ${error}`;
}
