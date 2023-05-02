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

// const updatedJobDetails = {
//         companyLogoUrl: jobDetails.company_logo_url,
//         companyWebsiteUrl: jobDetails.company_website_url,
//         employmentType: jobDetails.employment_type,
//         id: jobDetails.id,
//         jobDescription: jobDetails.job_description,
//         skills: jobDetails.skills,
//         lifeAtCompany: jobDetails.life_at_company,
//         location: jobDetails.location,
//         packagePerAnnum: jobDetails.package_per_annum,
//         rating: jobDetails.rating,
//         similarJobs: jobDetails.similar_jobs,
//       }

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    employmentType: [],
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
    this.setState({profileDetails: data})
  }

  getJobsList = async () => {
    const {employmentType, search, salaryRange} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&search=${search}&minimum_package=${salaryRange}`
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
      console.log(await response.json())
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

  renderSuccessContentView = () => {
    const {jobsList, search} = this.state
    return (
      <div className="content">
        <div className="search-tab">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={this.onSearchChange}
            onKeyUp={this.onSearchEnter}
          />
          <BsSearch className="search-icon" />
        </div>
        <ul className="jobs-list">
          {jobsList.map(eachJob => {
            const {id} = eachJob
            return <JobItem key={id} jobDetails={eachJob} />
          })}
        </ul>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader width={160} type="TailSpin" className="loader" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
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

  render() {
    const {profileDetails, jobsApiStatus} = this.state

    return (
      <div className="jobs-container">
        <Header className="header" />
        <div className="jobs-content-container">
          <div className="sidebar">
            <div className="profile-tab">
              <img src={profileDetails.profile_image_url} alt="profile" />
              <h1>{profileDetails.name}</h1>
              <p>{profileDetails.short_bio}</p>
            </div>
            <hr />
            <div>
              <h1>Type of Employment</h1>
              {employmentTypesList.map(eachType => {
                const {employmentTypeId} = eachType
                return (
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
                )
              })}
            </div>
            <hr />
            <div>
              <h1>Salary Range</h1>
              {salaryRangesList.map(eachType => {
                const {salaryRangeId} = eachType
                return (
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
                )
              })}
            </div>
          </div>
          {this.renderContent(jobsApiStatus)}
        </div>
      </div>
    )
  }
}

export default Jobs
