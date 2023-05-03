import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: '',
    employmentType: '',
    search: '',
    salaryRange: '',
    jobsApiStatus: apiStatusConstrains.initial,
    profileApiStatus: apiStatusConstrains.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  onFetchSuccess = data => {
    this.setState({
      profileDetails: data,
      profileApiStatus: apiStatusConstrains.success,
    })
  }

  onFetchFailure = () => {
    this.setState({
      profileApiStatus: apiStatusConstrains.failure,
    })
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusConstrains.initial})
    const {employmentType, search, salaryRange} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${search}`
    console.log(url)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.jobs
      const updatedJobDetails = jobDetails.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobDetails,
        jobsApiStatus: apiStatusConstrains.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstrains.failure})
    }
  }

  getProfileDetails = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      this.onFetchSuccess(profileDetails)
    } else {
      this.onFetchFailure()
    }
  }

  onChangeCheckBox = event => {
    const {employmentType} = this.state
    if (event.target.checked === true) {
      this.setState(prevState => {
        const updatedEmploymentType = [
          ...prevState.employmentType,
          event.target.value,
        ]
        return {employmentType: updatedEmploymentType}
      }, this.getJobsList)
    } else {
      const index = employmentType.findIndex(
        eachElement => eachElement === event.target.value,
      )
      employmentType.splice(index, 1)

      this.setState({employmentType}, this.getJobsList)
    }
  }

  onSearchChange = event => this.setState({search: event.target.value})

  onSearchEnter = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  onChangeRadioBox = event => {
    if (event.target.checked === true) {
      this.setState({salaryRange: event.target.value}, this.getJobsList)
    }
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  renderSuccessContentView = () => {
    const {jobsList, search} = this.state
    return (
      <div className="content">
        <div className="search-tab">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={this.onSearchChange}
            // onKeyUp={this.onSearchEnter}
          />
          <button
            type="button"
            onClick={this.onClickSearch}
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        {jobsList.length < 1 ? (
          <div className="not-found-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        ) : (
          <ul className="jobs-list">
            {jobsList.map(eachJob => {
              const {id} = eachJob
              return <JobItem key={id} jobDetails={eachJob} />
            })}
          </ul>
        )}
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader width={160} type="TailSpin" className="loader" />
    </div>
  )

  onClickJobsRetry = () => {
    this.getJobsList()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickJobsRetry}>
        Retry
      </button>
    </div>
  )

  renderContent = jobsApiStatus => {
    switch (jobsApiStatus) {
      case apiStatusConstrains.initial:
        return this.renderLoaderView()
      case apiStatusConstrains.success:
        return this.renderSuccessContentView()
      case apiStatusConstrains.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  renderSuccessProfileView = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-tab">
        <img src={profileDetails.profile_image_url} alt="profile" />
        <h1>{profileDetails.name}</h1>
        <p>{profileDetails.short_bio}</p>
      </div>
    )
  }

  onClickProfileRetry = () => this.getProfileDetails()

  renderProfileFailureView = () => (
    <div className="profile-failure-view">
      <button type="button" onClick={this.onClickProfileRetry}>
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstrains.initial:
        return this.renderLoaderView()
      case apiStatusConstrains.success:
        return this.renderSuccessProfileView()
      case apiStatusConstrains.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  render() {
    const {jobsApiStatus} = this.state

    return (
      <div className="jobs-container">
        <Header className="header" />
        <div className="jobs-content-container">
          <div className="sidebar">
            {this.renderProfile()}

            <hr />
            <div className="employment-container">
              <h1>Type of Employment</h1>
              <ul className="employment-list">
                {employmentTypesList.map(eachType => {
                  const {employmentTypeId} = eachType
                  return (
                    <li key={employmentTypeId}>
                      <div className="employment-type" key={employmentTypeId}>
                        <input
                          type="checkbox"
                          id={eachType.employmentTypeId}
                          value={eachType.employmentTypeId}
                          onChange={this.onChangeCheckBox}
                        />
                        <label htmlFor={eachType.employmentTypeId}>
                          {eachType.label}
                        </label>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <hr />
            <div className="salary-range-container">
              <h1>Salary Range</h1>
              <ul className="salary-range-list">
                {salaryRangesList.map(eachType => {
                  const {salaryRangeId} = eachType
                  return (
                    <li key={salaryRangeId}>
                      <div className="employment-type" key={salaryRangeId}>
                        <input
                          type="radio"
                          id={eachType.salaryRangeId}
                          name="salary-range"
                          onChange={this.onChangeRadioBox}
                          value={salaryRangeId}
                        />
                        <label htmlFor={eachType.salaryRangeId}>
                          {eachType.label}
                        </label>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          {this.renderContent(jobsApiStatus)}
        </div>
      </div>
    )
  }
}

export default Jobs
