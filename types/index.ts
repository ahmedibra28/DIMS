export interface NoticeProp {
  id: string
  title: string
  note: string
  createdAt: Date
  createdBy: {
    name: string
  }
}

export interface TransactionProp {
  id: string
  amount: number
  paymentStatus: 'UNPAID' | 'PAID'
  type: 'TUITION_PAYMENT' | 'ENROLLMENT_FEE'
  semester?: number
  shift?: 'MORNING' | 'AFTERNOON'
  createdAt: Date
  student?: {
    rollNo?: string
    name?: string
  }
  course?: {
    name?: string
  }
}

export interface ExamProp {
  course: string
  semester: number
  subjects: {
    name: string
    originalTheoryMarks: number
    originalPracticalMarks: number
    marks: Array<{
      examination: string
      theoryMarks: number
      practicalMarks: number
    }>
  }[]
}

export interface ResourcesProp {
  semester: number
  course: {
    id: string
    name: string
    subject: {
      id: string
      semester: number
      name: string
      resources: {
        file: string
      }[]
    }[]
  }
}

export interface SubjectProp {
  semester: number
  shift: 'MORNING' | 'AFTERNOON'
  course: {
    name: string
    subject: {
      name: string
      examDescription: string
      examDate: Date
    }[]
  }
  student: {
    rollNo: string
    image: string
    name: string
  }
}

export interface InstructorSubjectProp {
  id: string
  semester: 2
  shift: string
  subject: {
    id: string
    name: string
    course: {
      id: string
      name: string
    }
  }
}

export interface AttendanceSummaryProp {
  course: string
  subject: string
  present: number
  absent: number
  semester?: number
  student?: {
    name: string
    rollNo: string
  }
}

export interface CountProp {
  label: string
  count: number
  isCurrency?: boolean
}
