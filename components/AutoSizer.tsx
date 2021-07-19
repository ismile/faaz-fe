import React from "react";

const AutoSizer = React.memo(({ interval, children, ...other }) => {
	const reference = React.useRef();
	const [size, setSize] = React.useState();
	React.useEffect(() => {
      	let storedWidth = size?.width;
      	let storedHeight = size?.height;
      	const id = setInterval(() => {
          	const element = reference.current;
        	if (element) {
              	const width = element.offsetWidth;
                const height = element.offsetHeight;
              	if (width != storedWidth || height != storedHeight) {
                  	storedWidth = width;
                  	storedHeight = height;
                    setSize({ width, height });
                }
            }
        }, interval ?? 100);
      	return () => {
        	clearInterval(id);
        };
	}, [interval]);
	return (
	  <div ref={reference} {...other}>
        {size && children && children(size.width, size.height)}
	  </div>
	);
});

export default AutoSizer
