## SpecStory

## Implementing Fade Animation for Modal Closure (1/22/2025, 2:52:08 PM)

_**User**_

I want the fadecontent animation also when closing the modal

---

_**Assistant**_

I'll help you modify the BookingModal component to animate when closing. We'll need to handle the closing animation before actually removing the modal from the DOM. Here's how to implement this:

```jsx:my-react-app/src/blocks/Components/BookingModal/BookingModal.jsx
// ... existing code ...
const BookingModal = ({ isOpen, onClose, systemName }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: new Date(),
    message: ''
  });

  // Handle animation on mount/unmount
  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  // Handle the close animation
  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(onClose, 300); // 300ms matches the animation duration
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <FadeContent 
        blur={true} 
        duration={300} 
        easing="ease-in-out" 
        initialOpacity={0}
        show={isVisible}
      >
        <div 
          className="bg-[#111111] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Book {systemName}</h2>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
// ... existing code ...
```

The changes include:

1. Added a new `isVisible` state to control the animation
2. Added a `useEffect` hook to set visibility when the modal opens
3. Created a new `handleClose` function that:
   - Sets `isVisible` to false (triggering the fade out animation)
   - Waits for the animation to complete before calling the original `onClose`
4. Updated the click handlers to use `handleClose` instead of `onClose`
5. Changed the `FadeContent` component to use `isVisible` instead of `isOpen`

The animation will now play when both opening and closing the modal. The 300ms timeout in `handleClose` matches the duration prop in the `FadeContent` component to ensure the animation completes before the modal is removed from the DOM.

---



---

