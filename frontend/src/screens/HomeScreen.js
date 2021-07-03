import { FaSchool, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'

const HomeScreen = () => {
  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Students Gender',
        data: [6500, 8500],
        backgroundColor: ['#ffa601', '#304ffe'],
        borderWidth: 0,
      },
    ],
  }

  const data2 = {
    labels: ['April', 'May', 'June'],
    datasets: [
      {
        label: 'Fees Collections',
        data: [121, 191, 302],
        backgroundColor: ['#fa8b6b', '#c02f73', '#965315'],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  return (
    <div className='row'>
      <div className='col-md-9 col-12'>
        <div className='row'>
          <div className='col-md-4 col-6'>
            <div className='card mb-3 bg-transparent shadow border-0'>
              <div className='card-body d-flex'>
                <div className='shadow-lg p-2 rounded-pill'>
                  <FaSchool className='mb-1 fs-1 text-primary' />
                </div>
                <div>
                  <div className='ms-3 text-muted'>
                    <span className='fw-bold letter font-monospace'>
                      Schools
                    </span>
                    <br />
                    <span className='fw-light'>7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 col-6'>
            <div className='card mb-3 bg-transparent shadow border-0'>
              <div className='card-body d-flex'>
                <div className='shadow-lg p-2 rounded-pill'>
                  <FaUserGraduate className='mb-1 fs-1 text-primary' />
                </div>
                <div>
                  <div className='ms-3 text-muted'>
                    <span className='fw-bold letter font-monospace'>
                      Students
                    </span>
                    <br />
                    <span className='fw-light'>15,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-4 col-6'>
            <div className='card mb-3 bg-transparent shadow border-0'>
              <div className='card-body d-flex'>
                <div className='shadow-lg p-2 rounded-pill'>
                  <FaChalkboardTeacher className='mb-1 fs-1 text-primary' />
                </div>
                <div>
                  <div className='ms-3 text-muted'>
                    <span className='fw-bold letter font-monospace'>
                      Instructors
                    </span>
                    <br />
                    <span className='fw-light'>800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-4'>
            <div className='card bg-transparent border-0'>
              <h5 className='card-title text-muted'>Students</h5>
              <Doughnut data={data} />
            </div>
          </div>
          <div className='col-8'>
            <div className='card bg-transparent border-0'>
              <h5 className='card-title text-muted'>Fees Collections</h5>
              <Bar data={data2} options={options} />
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-3 col-12 border border-primary border-bottom-0 border-top-0 border-end-0'>
        <div className='card bg-transparent border-0'>
          <div className='card-body'>
            <h4 className='card-title font-monospace text-center'>
              Notice Board
            </h4>
            <hr />
            <div className='card-text'>
              <p className='badge rounded-pill bg-primary'>16 June, 2021</p>
              <p>
                <span>Great School manag mene esom text of the printing.</span>
                <br />
                <span className='text-muted'>Jennyfar Lopez - 5 min ago</span>
              </p>
            </div>
            <div className='card-text'>
              <p className='badge rounded-pill bg-primary'>15 June, 2021</p>
              <p>
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae.
                </span>
                <br />
                <span className='text-muted'>Susan Abdi - 24 hrs ago</span>
              </p>
            </div>
            <div className='card-text'>
              <p className='badge rounded-pill bg-primary'>14 June, 2021</p>
              <p>
                <span>
                  Magni totam, dolorum error hic inventore est minima doloremque
                  eligendi esse nemo quidem vero dicta, qui explicabo repellat
                  pariatur ipsam eius!.
                </span>
                <br />
                <span className='text-muted'>Ahmed - 2 days ago</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
