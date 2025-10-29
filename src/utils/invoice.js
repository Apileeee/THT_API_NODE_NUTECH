function generateInvoice() {
  const date = new Date();
  const d = date.toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.floor(Math.random() * 900) + 100;
  return `INV${d}-${rand}`;
}

module.exports = { generateInvoice };
