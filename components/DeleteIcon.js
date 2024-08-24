// components/DeleteIcon.js
const DeleteIcon = ({ fill = 'currentColor', size, height, width, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      height={size || height || 24}
      width={size || width || 24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1M18 8H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8z"
      />
    </svg>
  );
};

export default DeleteIcon;
