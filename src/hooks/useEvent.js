import { useEffect } from 'react';

//Hook for global events
export default function useEvent(event, handler, passive=false) {
    useEffect(() => {
        // Initiate the event handler
        window.addEventListener(event, handler, passive);

        // This will clean up the event every time the component is re-rendered
        return function cleanup() {
            window.removeEventListener(event, handler);
        };
    });
}