export default class InfiniteGrid {
 constructor({ el, sources, data, originalSize, onItemClick }) {
 this.$container = el;
 this.sources = sources;
 this.data = data;
 this.originalSize = originalSize;
 this.onItemClick = onItemClick;
 this.enabled = true;

 // Fixed grid layout (non-overlapping) like the reference.
 this.layout = {
 cols: 4,
 rows: 3,
 gap: 44,
 margin: 40,
 aspect: 3 / 4, // height = width * aspect (4:3 card)
 };

 this.scroll = {
 ease: 0.1,
 current:{ x: 0, y: 0 },
 target: { x: 0, y: 0 },
 last: { x: 0, y: 0 },
 delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } }
 };

 this.isDragging = false;
 this.drag = { startX: 0, startY: 0, scrollX: 0, scrollY: 0 };
 this.dragMoved = false;

 this.mouse = {
 x: { t: 0.5, c: 0.5 },
 y: { t: 0.5, c: 0.5 },
 press: { t: 0, c: 0 },
 };

 this.items = [];

 this.onResize = this.onResize.bind(this);
 this.onWheel = this.onWheel.bind(this);
 this.onMouseMove = this.onMouseMove.bind(this);
 this.onMouseDown = this.onMouseDown.bind(this);
 this.onMouseUp = this.onMouseUp.bind(this);
 this.render = this.render.bind(this);

 window.addEventListener('resize', this.onResize);
 window.addEventListener('wheel', this.onWheel, { passive: false });
 window.addEventListener('mousemove', this.onMouseMove);
 this.$container.addEventListener('mousedown', this.onMouseDown);
 window.addEventListener('mouseup', this.onMouseUp);

 this.onResize();
 this.render();
 }

 onResize() {
 this.winW = window.innerWidth;
 this.winH = window.innerHeight;

 const cols = this.layout.cols;
 const rows = this.layout.rows;
 const gap = this.layout.gap;
 const margin = this.layout.margin;

 // Keep tiles fitting the viewport so we never visually"eat" the gaps.
 const tileW =
 (this.winW - margin * 2 - gap * (cols - 1)) / cols;
 const tileH = tileW * this.layout.aspect;
 const halfGap = gap / 2;

 // Effective outer size per tile includes the gap padding on both sides.
 const outerW = tileW + gap;
 const outerH = tileH + gap;

 // Total set size across the visible grid (outer tiles abut each other).
 const setW = cols * outerW;
 const setH = rows * outerH;

 // Center the grid vertically if there's extra space.
 const topOffset = Math.max(margin, (this.winH - setH) / 2);
 const leftOffset = Math.max(margin, (this.winW - setW) / 2);

 this.tileSize = { w: setW, h: setH, tileW, tileH, gap, halfGap, leftOffset, topOffset };

 this.scroll.current = { x: 0, y: 0 };
 this.scroll.target = { x: 0, y: 0 };
 this.scroll.last = { x: 0, y: 0 };

 this.$container.innerHTML ='';

 const baseItems = [];
 const total = cols * rows;

 for (let i = 0; i < total; i++) {
 const col = i % cols;
 const row = Math.floor(i / cols);
 const source = this.sources[i % this.sources.length];

 baseItems.push({
 src: source.src,
 caption: source.caption,
 sourceIndex: i % this.sources.length,
 x: leftOffset + col * outerW,
 y: topOffset + row * outerH,
 w: tileW,
 h: tileH,
 });
 }

 this.items = [];
 const repsX = [0, this.tileSize.w];
 const repsY = [0, this.tileSize.h];

 baseItems.forEach(base => {
 repsX.forEach(offsetX => {
 repsY.forEach(offsetY => {
 const el = document.createElement('div');
 el.classList.add('item');
 // Add internal padding so gaps stay visually consistent even with borders/hover.
 el.style.padding = `${this.tileSize.halfGap}px`;
 el.style.width = `${base.w + this.tileSize.gap}px`;
 el.style.height = `${base.h + this.tileSize.gap}px`;

 const wrapper = document.createElement('div');
 wrapper.classList.add('item-wrapper');
 el.appendChild(wrapper);

 const itemImage = document.createElement('div');
 itemImage.classList.add('item-image');
 itemImage.style.width = `${base.w}px`;
 itemImage.style.height = `${base.h}px`;
 wrapper.appendChild(itemImage);

 const img = new Image();
 img.loading ='lazy';
 img.decoding ='async';
 img.referrerPolicy ='no-referrer';
 img.src = base.src;
 img.alt = base.caption;
 itemImage.appendChild(img);

 const caption = document.createElement('small');
 caption.classList.add('caption');
 caption.textContent = base.caption;
 wrapper.appendChild(caption);

 if (typeof this.onItemClick ==='function') {
 el.style.cursor ='pointer';
 el.addEventListener('click', (event) => {
 // Ignore clicks when the user was dragging.
 if (this.isDragging || this.dragMoved) return;
 event.stopPropagation();
 const rect = itemImage.getBoundingClientRect();
 this.onItemClick({
 index: base.sourceIndex,
 src: base.src,
 caption: base.caption,
 rect: {
 left: rect.left,
 top: rect.top,
 width: rect.width,
 height: rect.height,
 },
 });
 });
 }

 this.$container.appendChild(el);

 this.items.push({
 el,
 container: itemImage,
 wrapper,
 img,
 x: base.x + offsetX,
 y: base.y + offsetY,
 w: base.w,
 h: base.h,
 extraX: 0,
 extraY: 0,
 rect: el.getBoundingClientRect(),
 ease: Math.random() * 0.5 + 0.5,
 depth: Math.random() * 0.75 + 0.25,
 });
 });
 });
 });

 // The repeated grid spans 2x in each axis (we created copies at +setW/+setH).
 // Wrapping by the full 2-set span prevents the duplicates from collapsing
 // onto each other (which can visually eliminate gaps).
 this.wrapSize = { w: this.tileSize.w * 2, h: this.tileSize.h * 2 };

 this.scroll.current.x = this.scroll.target.x = this.scroll.last.x = -this.winW * 0.1;
 this.scroll.current.y = this.scroll.target.y = this.scroll.last.y = -this.winH * 0.1;
 }

 onWheel(e) {
 if (!this.enabled) return;
 e.preventDefault();
 const factor = 0.9;
 this.scroll.target.x -= e.deltaX * factor;
 this.scroll.target.y -= e.deltaY * factor;
 }

 onMouseDown(e) {
 if (!this.enabled) return;
 e.preventDefault();
 this.isDragging = true;
 this.dragMoved = false;
 document.documentElement.classList.add('dragging');
 this.mouse.press.t = 1;
 this.drag.startX = e.clientX;
 this.drag.startY = e.clientY;
 this.drag.scrollX = this.scroll.target.x;
 this.drag.scrollY = this.scroll.target.y;
 }

 onMouseUp() {
 this.isDragging = false;
 document.documentElement.classList.remove('dragging');
 this.mouse.press.t = 0;
 }

 onMouseMove(e) {
 if (!this.enabled) return;
 this.mouse.x.t = e.clientX / this.winW;
 this.mouse.y.t = e.clientY / this.winH;

 if (this.isDragging) {
 const dx = e.clientX - this.drag.startX;
 const dy = e.clientY - this.drag.startY;
 if (!this.dragMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
 this.dragMoved = true;
 }
 this.scroll.target.x = this.drag.scrollX + dx;
 this.scroll.target.y = this.drag.scrollY + dy;
 }
 }

 render() {
 this.scroll.current.x += (this.scroll.target.x - this.scroll.current.x) * this.scroll.ease;
 this.scroll.current.y += (this.scroll.target.y - this.scroll.current.y) * this.scroll.ease;

 this.scroll.delta.x.t = this.scroll.current.x - this.scroll.last.x;
 this.scroll.delta.y.t = this.scroll.current.y - this.scroll.last.y;
 this.scroll.delta.x.c += (this.scroll.delta.x.t - this.scroll.delta.x.c) * 0.04;
 this.scroll.delta.y.c += (this.scroll.delta.y.t - this.scroll.delta.y.c) * 0.04;
 this.mouse.x.c += (this.mouse.x.t - this.mouse.x.c) * 0.04;
 this.mouse.y.c += (this.mouse.y.t - this.mouse.y.c) * 0.04;
 this.mouse.press.c += (this.mouse.press.t - this.mouse.press.c) * 0.04;

 const dirX = this.scroll.current.x > this.scroll.last.x ?'right' :'left';
 const dirY = this.scroll.current.y > this.scroll.last.y ?'down' :'up';

 this.items.forEach(item => {
 // No parallax: keep tiles rigid in the grid.
 const newX = 0;
 const newY = 0;
 const scrollX = this.scroll.current.x;
 const scrollY = this.scroll.current.y;
 const posX = item.x + scrollX + item.extraX + newX;
 const posY = item.y + scrollY + item.extraY + newY;

 const beforeX = posX > this.winW;
 const afterX = posX + item.rect.width < 0;
 if (dirX ==='right' && beforeX) item.extraX -= this.wrapSize.w;
 if (dirX ==='left' && afterX) item.extraX += this.wrapSize.w;

 const beforeY = posY > this.winH;
 const afterY = posY + item.rect.height < 0;
 if (dirY ==='down' && beforeY) item.extraY -= this.wrapSize.h;
 if (dirY ==='up' && afterY) item.extraY += this.wrapSize.h;

 const fx = item.x + scrollX + item.extraX + newX;
 const fy = item.y + scrollY + item.extraY + newY;
 item.el.style.transform = `translate(${fx}px, ${fy}px)`;

 // No parallax (keep a tiny scale for coverage).
 item.img.style.transform = `translate(0px, 0px) scale(1.04)`;
 });

 this.scroll.last.x = this.scroll.current.x;
 this.scroll.last.y = this.scroll.current.y;

 requestAnimationFrame(this.render);
 }

 destroy() {
 window.removeEventListener('resize', this.onResize);
 window.removeEventListener('wheel', this.onWheel);
 window.removeEventListener('mousemove', this.onMouseMove);
 this.$container.removeEventListener('mousedown', this.onMouseDown);
 window.removeEventListener('mouseup', this.onMouseUp);
 }

 setEnabled(next) {
 this.enabled = Boolean(next);
 if (!this.enabled) {
 this.isDragging = false;
 this.dragMoved = false;
 this.mouse.press.t = 0;
 document.documentElement.classList.remove('dragging');
 }
 }
}
