import LazyLoad from 'react-lazyload'

const ImageLazyLoad = ({
  height = 200,
  width = 200,
  image,
  alt,
  circle = false,
  style = {},
  className = '',
}) => {
  return (
    <LazyLoad height={height} once>
      {/*  eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        width={width}
        height={height}
        className={`img-fluid ${className ? className : ''} ${
          circle ? 'rounded-circle' : ''
        }`}
        alt={alt}
        style={style}
      />
    </LazyLoad>
  )
}

export default ImageLazyLoad
