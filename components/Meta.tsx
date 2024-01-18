interface Props {
  title?: string
  description?: string
  author?: string
  image?: string
  keyword?: string
  asPath?: string
}

const Meta = ({
  title = 'SaMTEC College Management Portal',
  description = `A comprehensive management system for SaMTEC College. Manage students, faculty, courses, exams, fees, timetables and all other college operations on one unified platform.`,
  image: outsideImage = 'https://ahmedibra.com/logo.png',
  asPath = '/',
  author = 'Ahmed Ibrahim',
  keyword = 'Ahmed',
}: Props) => {
  const url = `https://ahmedibra.com${asPath}`
  const image = outsideImage
    ? `https://ahmedibra.com${outsideImage}`
    : `https://ahmedibra.com/logo.png`

  return {
    // viewport: {
    //   width: 'device-width',
    //   initialScale: 1,
    //   maximumScale: 1,
    // },
    title: title ? title : title,
    description: description ? description : description,
    image: image,

    metadataBase: new URL('https://ahmedibra.com'),
    alternates: {
      canonical: url,
      languages: {
        'en-US': '/en-US',
      },
    },
    openGraph: {
      type: 'website',
      images: image,
      title: title ? title : title,
      description: description ? description : description,
    },
    keywords: [
      `${keyword} college management system, student management, faculty management, course management, exams, fee management, timetable management, ERP, education administration`,
    ],
    authors: [
      {
        name: author ? author : author,
        url: 'https://ahmedibra.com',
      },
    ],
    publisher: author ? author : author,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icon: '/logo.png',
    twitter: {
      card: 'summary_large_image',
      title: title ? title : title,
      description: description ? description : description,
      // siteId: '1467726470533754880',
      // creatorId: '1467726470533754880',
      creator: `@${author ? author : author}`,
      images: {
        url: image,
        alt: title ? title : title,
      },
      app: {
        name: 'twitter_app',
        id: {
          iphone: 'twitter_app://iphone',
          ipad: 'twitter_app://ipad',
          googleplay: 'twitter_app://googleplay',
        },
        url: {
          iphone: image,
          ipad: image,
        },
      },
    },
    appleWebApp: {
      title: title ? title : title,
      statusBarStyle: 'black-translucent',
      startupImage: [
        '/logo.png',
        {
          url: '/logo.png',
          media: '(device-width: 768px) and (device-height: 1024px)',
        },
      ],
    },
    verification: {
      google: 'google',
      yandex: 'yandex',
      yahoo: 'yahoo',
      other: {
        me: ['info@ahmedibra.com', 'http://ahmedibra.com'],
      },
    },
  }
}
export default Meta
