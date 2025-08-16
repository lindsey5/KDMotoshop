export const receiptHTML = ({ order, receiptContent } : { order : Order , receiptContent : string}) => {
     return (
        `
            <!DOCTYPE html>
            <html>
            <head>
            <title>Receipt - Order #${order.order_id}</title>
            <style>
                body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
                margin: 20px;
                background: white;
                }
                .receipt-container {
                max-width: 300px;
                margin: 0 auto;
                }
                .dashed-border {
                border-top: 2px dashed #666;
                border-bottom: 2px dashed #666;
                }
                .dashed-line {
                border-bottom: 1px dashed #666;
                }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .text-xs { font-size: 10px; }
                .text-sm { font-size: 11px; }
                .text-base { font-size: 12px; }
                .text-lg { font-size: 14px; }
                .mb-1 { margin-bottom: 4px; }
                .mb-2 { margin-bottom: 8px; }
                .mb-4 { margin-bottom: 16px; }
                .mt-1 { margin-top: 4px; }
                .mt-2 { margin-top: 8px; }
                .mt-4 { margin-top: 16px; }
                .pb-1 { padding-bottom: 4px; }
                .pb-3 { padding-bottom: 12px; }
                .pb-4 { padding-bottom: 16px; }
                .pt-2 { padding-top: 8px; }
                .pt-3 { padding-top: 12px; }
                .pt-4 { padding-top: 16px; }
                .ml-2 { margin-left: 8px; }
                .pr-2 { padding-right: 8px; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .flex-1 { flex: 1; }
                .whitespace-nowrap { white-space: nowrap; }
                .text-gray-600 { color: #666; }
                .barcode {
                display: flex;
                gap: 1px;
                justify-content: center;
                margin: 10px 0;
                }
                .bar {
                width: 2px;
                background: black;
                }
                .bar-tall { height: 20px; }
                .bar-short { height: 15px; }
                @media print {
                body { margin: 0; }
                .no-print { display: none; }
                }
            </style>
            </head>
            <body>
            <div class="receipt-container">
                ${receiptContent}
            </div>
            <script>
                window.onload = function() {
                window.print();
                window.onafterprint = function() {
                    window.close();
                };
                };
            </script>
            </body>
            </html>
        `
     )
}