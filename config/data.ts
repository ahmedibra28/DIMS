const roles = [
  {
    id: 'HzdmUa40IctkReRd2Pofm',
    name: 'Super Admin',
    description:
      'Super Admins have the highest level of access and authority in the system.',
    type: 'SUPER_ADMIN',
  },
  {
    id: '2m4Qsx2e-g96eMw0X2qul',
    name: 'Admin',
    description: 'Admins have substantial access and control over the system.',
    type: 'ADMIN',
  },
  {
    id: 'ae0-0NVU0ncKhdOJrbLBc',
    name: 'Student',
    description:
      'Students are users with access to educational resources and specific features within the system.',
    type: 'STUDENT',
  },
  {
    id: '6G-3UmJr0QPKlR6rm8n8x',
    name: 'Instructor',
    description:
      'Instructors have specialized access and control within the system to facilitate teaching and learning.',
    type: 'INSTRUCTOR',
  },
  {
    id: 'DYe_C4Xz7kj_vDN7qUdq4',
    name: 'Finance',
    description:
      'Finance personnel have access to financial features and settings within the system.',
    type: 'FINANCE',
  },
  {
    id: 'wtB-DWHDs3DIzfZv5ZWI0',
    name: 'Exam',
    description:
      'Exam personnel have access to exam-related features and settings in the system.',
    type: 'EXAM',
  },
]

const users = {
  id: 'e5cTUpLtGS7foE42nJuwp',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  confirmed: true,
  blocked: false,
  mobile: 615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const profile = {
  id: 'hMXCyzI2MLXNI6tQ-sU0i',
  mobile: 615301507,
  address: 'Mogadishu',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  normal: 2,
  admin: 3,
  setting: 4,
  finance: 5,
  report: 6,
}

const clientPermissions = [
  {
    id: 'MZ4Qsx2e-g96eMw0X2qul',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    id: 'IYN1EVSvUg0o5pAxgPEPi',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    id: 'VFGo5W_hc3O85QCOouabO',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    id: 't-Snd86AW-TlIlMEDmYyt',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    id: 'eWpbNJ9LkTVO4BYyaO1mJ',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC2',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGsOC2',
    name: 'Database',
    path: '/admin/database',
    menu: 'admin',
    sort: sort.admin,
    description: 'Database page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC3',
    name: 'School',
    path: '/setting/schools',
    menu: 'setting',
    sort: sort.setting,
    description: 'School page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC4',
    name: 'Course',
    path: '/setting/courses',
    menu: 'setting',
    sort: sort.setting,
    description: 'Course page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC5',
    name: 'Subject',
    path: '/setting/subjects',
    menu: 'setting',
    sort: sort.setting,
    description: 'Subject page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC6',
    name: 'Student',
    path: '/students',
    menu: 'normal',
    sort: sort.normal,
    description: 'Student page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC7',
    name: 'Instructor',
    path: '/instructors',
    menu: 'normal',
    sort: sort.normal,
    description: 'Instructor page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC9',
    name: 'Student Details',
    path: '/students/[id]/assign-course',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Student Details & Assign to Course page',
  },
  {
    id: 'I6b_3jAPx9IGclV3o7_1a',
    name: 'Instructor Details',
    path: '/instructors/[id]/assign-subject',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Instructor Details & Assign to Subject page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC8',
    name: 'Notice',
    path: '/admin/notices',
    menu: 'admin',
    sort: sort.admin,
    description: 'Notice page',
  },
  {
    id: 'YTU-o6vjJk4A-6uM8kgx4',
    name: 'Generate Tuition Fee',
    path: '/finance/generate-tuition-fee',
    menu: 'finance',
    sort: sort.finance,
    description: 'Generate Tuition Fee page',
  },
  {
    id: 'YTU-o6vjJk4A-6MM8kgx4',
    name: 'Generate Clearance Card',
    path: '/finance/generate-clearance-card',
    menu: 'finance',
    sort: sort.finance,
    description: 'Generate Clearance Card page',
  },
  {
    id: 'YTU-o6vjJk4A-6uM8kgx6',
    name: 'Admission Fee',
    path: '/finance/admission-fee',
    menu: 'finance',
    sort: sort.finance,
    description: 'Admission Fee page',
  },
  {
    id: 'YTU-o6vjJk4A-6uM8kgx7',
    name: 'Tuition Fee',
    path: '/finance/tuition-fee',
    menu: 'finance',
    sort: sort.finance,
    description: 'Tuition Fee page',
  },
  {
    id: 'YTU-o6vjJk4A-6uM8kgx5',
    name: 'Lesson Plan',
    path: '/lesson-plans',
    menu: 'normal',
    sort: sort.normal,
    description: 'Lesson Plan page',
  },
  {
    id: '8ApAOn7ELEiJTgn5uvjkz',
    name: 'Resource',
    path: '/resources',
    menu: 'normal',
    sort: sort.normal,
    description: 'Resource page',
  },
  {
    id: 'DCeQkifIBSpeAsIaeBqOU',
    name: 'Suggestion',
    path: '/suggestions',
    menu: 'normal',
    sort: sort.normal,
    description: 'Suggestion page',
  },
  {
    id: 'YTU-o6vjJk4A-6uM8kgx8',
    name: 'Examination',
    path: '/examination/[id]',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Examination page',
  },
  {
    id: 'YTU-o6vjJk4A-6uM8kgxY',
    name: 'Attendance',
    path: '/attendance',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Attendance page',
  },
  {
    id: 'YTU-o6vjJk4A-6uM8kgxX',
    name: 'Payment Transaction',
    path: '/report/payment-transaction',
    menu: 'report',
    sort: sort.report,
    description: 'Payment Transaction page',
  },
]

const permissions = [
  // Users
  {
    id: 'fCuAED2qkbOmWYmKsOa-_',
    description: 'Users',
    route: '/api/users',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'UzN2L6RQ_gUM0_JN4ALkB',
    description: 'User Client Permissions',
    route: '/api/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'rqRYCpC0yytkColvHwY3C',
    description: 'User',
    route: '/api/users',
    name: 'Users',
    method: 'POST',
  },
  {
    id: 'xsei4vGvYpoXw3V0_Bgcy',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    id: '27vMGpNbQGLKtuaIsTAcF',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   Profile
  {
    id: 'Fyph8SxjGayAHr8g65Rie',
    description: 'Profile',
    route: '/api/profile',
    name: 'Profile',
    method: 'GET',
  },
  {
    id: 'LMG211l6gxRRkjAHPvhgw',
    description: 'Profile',
    route: '/api/profile/:id',
    name: 'Profile',
    method: 'PUT',
  },

  //   Role
  {
    id: '2xiakJtuDptmlP7fxgggo',
    description: 'Roles',
    route: '/api/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    id: 'HQ8Drbd0-KOMequqhQVuG',
    description: 'Role',
    route: '/api/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    id: 'GzrnbouFYGvGfvdAfbiZT',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    id: 'KrZ76u2VUI9qICSJhsuW5',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    id: '9P0mpbew9dYW4oF9cM-mO',
    description: 'Permissions',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    id: 'n0dw4GMpgiXfySbdlGhs0',
    description: 'Permission',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    id: 'tK5RgtYLe9yFNgF93m6TO',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    id: 'cn25W3-inLybNRkCMHgNC',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   Client Permission
  {
    id: 'X26iEN1J-LBaC4HlPsRgh',
    description: 'Client Permissions',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    id: 'HRu69jNp0j4pJXs_cjCQ5',
    description: 'Client Permission',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    id: 'X9ACZfrFX9CAl-2uPXyw9',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxA',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },
  //  Upload
  {
    id: 'YTU-o6vjJk4A-4uM8kgxM',
    description: 'Upload',
    route: '/api/uploads',
    name: 'Upload',
    method: 'POST',
  },
  //   Database
  {
    id: 'X26iEN1a-LBaC4HlPsRgh',
    description: 'Download database',
    route: '/api/databases/download',
    name: 'Database',
    method: 'POST',
  },
  {
    id: 'X26iEN1a-LBaC4HlPPRgh',
    description: 'Get databases',
    route: '/api/databases',
    name: 'Database',
    method: 'GET',
  },
  {
    id: 'HRu69jNpsj4pJXs_cjCQ5',
    description: 'Database',
    route: '/api/databases/backup',
    name: 'Backup database',
    method: 'POST',
  },

  // School
  {
    id: 'CN6RLsmP_3BDGSWYB06EU',
    description: 'School',
    route: '/api/schools',
    name: 'School',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxO',
    description: 'School',
    route: '/api/schools',
    name: 'School',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxP',
    description: 'School',
    route: '/api/schools/:id',
    name: 'School',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxQ',
    description: 'School',
    route: '/api/schools/:id',
    name: 'School',
    method: 'DELETE',
  },

  // Course
  {
    id: 'YTU-o6vjJk4A-4uM8kgxR',
    description: 'Course',
    route: '/api/courses',
    name: 'Course',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxS',
    description: 'Course',
    route: '/api/courses',
    name: 'Course',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxT',
    description: 'Course',
    route: '/api/courses/:id',
    name: 'Course',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxU',
    description: 'Course',
    route: '/api/courses/:id',
    name: 'Course',
    method: 'DELETE',
  },

  // Subject
  {
    id: 'YTU-o6vjJk4A-4uM8kgxV',
    description: 'Subject',
    route: '/api/subjects',
    name: 'Subject',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxW',
    description: 'Subject',
    route: '/api/subjects',
    name: 'Subject',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxX',
    description: 'Subject',
    route: '/api/subjects/:id',
    name: 'Subject',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxY',
    description: 'Subject',
    route: '/api/subjects/:id',
    name: 'Subject',
    method: 'DELETE',
  },

  // Student
  {
    id: 'YTU-o6vjJk4A-4uM8kgxZ',
    description: 'Student',
    route: '/api/students',
    name: 'Student',
    method: 'GET',
  },
  {
    id: 'gob4iLXnCtTi1yvU9_9-A',
    description: 'Student',
    route: '/api/students',
    name: 'Student',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxb',
    description: 'Student',
    route: '/api/students/:id',
    name: 'Student',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxc',
    description: 'Student',
    route: '/api/students/:id',
    name: 'Student',
    method: 'DELETE',
  },
  {
    id: 'YTU-o6kjJk4A-juM8kgxh',
    description: 'Get Student Details',
    route: '/api/students/:id',
    name: 'Student',
    method: 'GET',
  },

  // Instructor
  {
    id: 'YTU-o6vjJk4A-4uM8kgxd',
    description: 'Instructor',
    route: '/api/instructors',
    name: 'Instructor',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxe',
    description: 'Instructor',
    route: '/api/instructors',
    name: 'Instructor',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxf',
    description: 'Instructor',
    route: '/api/instructors/:id',
    name: 'Instructor',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxg',
    description: 'Instructor',
    route: '/api/instructors/:id',
    name: 'Instructor',
    method: 'DELETE',
  },
  {
    id: 'YTU-o6vjJk4A-juM8kgxh',
    description: 'Get Instructor Details',
    route: '/api/instructors/:id',
    name: 'Instructor',
    method: 'GET',
  },

  // Notice
  {
    id: 'YTU-o6vjJk4A-4uM8kgxh',
    description: 'Notice',
    route: '/api/notices',
    name: 'Notice',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxi',
    description: 'Notice',
    route: '/api/notices',
    name: 'Notice',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxj',
    description: 'Notice',
    route: '/api/notices/:id',
    name: 'Notice',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxk',
    description: 'Notice',
    route: '/api/notices/:id',
    name: 'Notice',
    method: 'DELETE',
  },

  // Assign Student to Course
  {
    id: 'YTU-o6vjJk4A-4uM8kgxl',
    description: 'Assign Student to Course',
    route: '/api/assign-student-to-course',
    name: 'Assign Student to Course',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxm',
    description: 'Assign Student to Course',
    route: '/api/assign-student-to-course',
    name: 'Assign Student to Course',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxn',
    description: 'Assign Student to Course',
    route: '/api/assign-student-to-course/:id',
    name: 'Assign Student to Course',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxo',
    description: 'Assign Student to Course',
    route: '/api/assign-student-to-course/:id',
    name: 'Assign Student to Course',
    method: 'DELETE',
  },
  {
    id: 'YTU-o6jjJk4A-4uM8kgxp',
    description: 'Get Assign Course by Student Id',
    route: '/api/assign-student-to-course/:id',
    name: 'Assign Student to Course',
    method: 'GET',
  },

  // Assign Instructor to Subject
  {
    id: 'YTU-o6vjJk4A-4uM8kgxp',
    description: 'Assign Instructor to Subject',
    route: '/api/assign-instructor-to-subject',
    name: 'Assign Instructor to Subject',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxq',
    description: 'Assign Instructor to Subject',
    route: '/api/assign-instructor-to-subject',
    name: 'Assign Instructor to Subject',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxr',
    description: 'Assign Instructor to Subject',
    route: '/api/assign-instructor-to-subject/:id',
    name: 'Assign Instructor to Subject',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxs',
    description: 'Assign Instructor to Subject',
    route: '/api/assign-instructor-to-subject/:id',
    name: 'Assign Instructor to Subject',
    method: 'DELETE',
  },
  {
    id: 'YTU-o6jjJk46-4uM8kgxp',
    description: 'Get Assign Subject by Instructor Id',
    route: '/api/assign-instructor-to-subject/:id',
    name: 'Assign Instructor to Subject',
    method: 'GET',
  },

  // Generate Tuition Fee
  {
    id: 'YTU-o6vjJk4A-4uM8kg44',
    description: 'Get Classes To Generate Tuition Fee',
    route: '/api/generate-tuition-fee',
    name: 'Finance',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx4',
    description: 'Generate Tuition Fee',
    route: '/api/generate-tuition-fee',
    name: 'Finance',
    method: 'POST',
  },
  // Generate Clearance Card
  {
    id: 'YTU-o6vjJk4A-MuM8kgx4',
    description: 'Get Classes To Generate Clearance Card',
    route: '/api/generate-clearance-card',
    name: 'Finance',
    method: 'GET',
  },
  {
    id: 'YTY-o6vjJk4A-4uM8kgx4',
    description: 'Generate Clearance Card',
    route: '/api/generate-clearance-card/:id',
    name: 'Finance',
    method: 'PUT',
  },

  // Admission Fee
  {
    id: 'wkQcIYKcLu7nMeDYZ7b2q',
    description: 'Admission Fee',
    route: '/api/admission-fee',
    name: 'Finance',
    method: 'GET',
  },
  {
    id: 'nUGiYb1gm4dcV4BBQb2Sk',
    description: 'Admission Fee',
    route: '/api/admission-fee/:id',
    name: 'Finance',
    method: 'PUT',
  },

  // Tuition Fee
  {
    id: 'NfxfcW-elq9To5i1YSRi0',
    description: 'Tuition Fee',
    route: '/api/tuition-fee',
    name: 'Finance',
    method: 'GET',
  },
  {
    id: 'mTnEuc5D84nwplmcsuqTS',
    description: 'Tuition Fee',
    route: '/api/tuition-fee/:id',
    name: 'Finance',
    method: 'PUT',
  },

  // Lesson Plan
  {
    id: 'YTU-o6vjJk4A-4uM8kgx5',
    description: 'Lesson Plan',
    route: '/api/lesson-plans',
    name: 'Lesson Plan',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx6',
    description: 'Lesson Plan',
    route: '/api/lesson-plans',
    name: 'Lesson Plan',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx7',
    description: 'Lesson Plan',
    route: '/api/lesson-plans/:id',
    name: 'Lesson Plan',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx8',
    description: 'Lesson Plan',
    route: '/api/lesson-plans/:id',
    name: 'Lesson Plan',
    method: 'DELETE',
  },

  // Resource
  {
    id: '1YKspa_noCOH6c0WDDOnd',
    description: 'Resource',
    route: '/api/resources',
    name: 'Resource',
    method: 'GET',
  },
  {
    id: 'KQHBzCAzyFgJKeasr-C1n',
    description: 'Resource',
    route: '/api/resources',
    name: 'Resource',
    method: 'POST',
  },
  {
    id: 'LaP4P8cGxykj3NiBbdh6x',
    description: 'Resource',
    route: '/api/resources/:id',
    name: 'Resource',
    method: 'PUT',
  },
  {
    id: 'coSDHgZjidk9gvuP4frkb',
    description: 'Resource',
    route: '/api/resources/:id',
    name: 'Resource',
    method: 'DELETE',
  },

  // Examination
  {
    id: 'YTU-o6vjJk4A-4uM8kgx9',
    description: 'Examination',
    route: '/api/examinations',
    name: 'Examination',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx0',
    description: 'Examination',
    route: '/api/examinations',
    name: 'Examination',
    method: 'POST',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx1',
    description: 'Examination',
    route: '/api/examinations/:id',
    name: 'Examination',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx2',
    description: 'Examination',
    route: '/api/examinations/:id',
    name: 'Examination',
    method: 'DELETE',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgx3',
    description: 'Get examination by student id',
    route: '/api/examinations/:id',
    name: 'Examination',
    method: 'GET',
  },
  {
    id: 'YTU-o6jjJk4A-4uM8kg44',
    description: 'Upgrade Class To Next Level',
    route: '/api/upgrade-class-to-next-level',
    name: 'Examination',
    method: 'POST',
  },

  // Suggestion
  {
    id: 'Wkezyl8YazqYdydJif16v',
    description: 'Suggestion',
    route: '/api/suggestions',
    name: 'Suggestion',
    method: 'GET',
  },
  {
    id: 'nZJDX-bV6LxtHXHhEr62I',
    description: 'Suggestion',
    route: '/api/suggestions',
    name: 'Suggestion',
    method: 'POST',
  },
  {
    id: '2RPTSI9uO031NvJrg6Ae1',
    description: 'Suggestion',
    route: '/api/suggestions/:id',
    name: 'Suggestion',
    method: 'PUT',
  },
  {
    id: 'eymr4Uwd5J7QBo6tSEWJU',
    description: 'Suggestion',
    route: '/api/suggestions/:id',
    name: 'Suggestion',
    method: 'DELETE',
  },

  // Attendance - Get & Post
  {
    id: 'YTU-16vjJk4A-4uM8kgxx',
    description: 'Attendance',
    route: '/api/attendances',
    name: 'Attendance',
    method: 'GET',
  },
  {
    id: 'YTU-o6vjJk4A-1uM8kgxg',
    description: 'Attendance',
    route: '/api/attendances',
    name: 'Attendance',
    method: 'POST',
  },
  {
    id: 'vs7hQ0q16WDX7Z8uAF0su',
    description: 'Attendance',
    route: '/api/attendances/:id',
    name: 'Attendance',
    method: 'PUT',
  },
  {
    id: 'RrtIDdd7j5MKiRqthWRDc',
    description: 'Attendance',
    route: '/api/attendances/:id',
    name: 'Attendance',
    method: 'DELETE',
  },

  // Reports
  {
    id: 'RrtIDdd7j5MKiRqthWRDF',
    description: 'Payment Transaction Reports',
    route: '/api/reports/payment-transactions',
    name: 'Reports',
    method: 'GET',
  },
]

export { roles, users, profile, permissions, clientPermissions }
