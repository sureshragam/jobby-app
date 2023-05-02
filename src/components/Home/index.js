import Header from '../Header'
import './index.css'

const Home = props => {
  const onFindJobs = () => {
    const {history} = props
    history.push('/jobs')
  }
  return (
    <div className="home-container">
      <Header />
      <div className="home-content-container">
        <h1>
          Find The Job That
          <br /> Fits Your Life
        </h1>
        <p>
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential
        </p>
        <button type="button" onClick={onFindJobs}>
          Find Jobs
        </button>
      </div>
    </div>
  )
}

export default Home
