const isTouch = () => {
 try {
 document.createEvent('TouchEvent');
 return true;
 } catch (e) {
 return false;
 }
}

const touchUtils = {
 isTouch: isTouch,
}

export default touchUtils
