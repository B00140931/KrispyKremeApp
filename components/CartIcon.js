export const CartIcon = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 21C9.82843 21 10.5 20.3284 10.5 19.5C10.5 18.6716 9.82843 18 9 18C8.17157 18 7.5 18.6716 7.5 19.5C7.5 20.3284 8.17157 21 9 21Z"
        fill={fill}
      />
      <path
        d="M18 21C18.8284 21 19.5 20.3284 19.5 19.5C19.5 18.6716 18.8284 18 18 18C17.1716 18 16.5 18.6716 16.5 19.5C16.5 20.3284 17.1716 21 18 21Z"
        fill={fill}
      />
      <path
        d="M3 2L5 2L6.68 14.39C6.74 14.83 7.13 15.16 7.57 15.16H19.84C20.25 15.16 20.61 14.9 20.7 14.5L22.71 6.5C22.8 6.09 22.49 5.7 22.07 5.7H7.1L6.65 2.7C6.58 2.28 6.21 2 5.79 2H3Z"
        fill={fill}
      />
      <path
        d="M5 6H22V8H5V6Z"
        fill={fill}
      />
    </svg>
  );
};