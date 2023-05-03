import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill, BsFillStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {apiStatus: apiStatusConstrains.initial, jobDetails: {}}

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstrains.initial})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
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
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      console.log(similarJobs)
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        similarJobs,
        title: jobDetails.title,
      }
      this.setState({
        jobDetails: updatedJobDetails,
        apiStatus: apiStatusConstrains.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstrains.failure})
    }
  }

  onClickJobItemRetry = () => {
    this.getJobItemDetails()
  }

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader type="ThreeDots" />
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      similarJobs,
      title,
    } = jobDetails
    return (
      <>
        <div className="job-item-details-content">
          <div className="item-row-1">
            <img
              className="item-row-1-col-1"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="item-row-1-col-2">
              <h1 className="title">{title}</h1>
              <div className="rating-tab">
                <BsFillStarFill className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="item-row-2">
            <div className="item-row-2-col-1">
              <div className="location-tab">
                <IoLocationSharp />
                <p className="location">{location}</p>
              </div>
              <div className="employment-tab">
                <BsBriefcaseFill />
                <p className="employment">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line" />
          <div className="item-row-3">
            <h1 className="description">Description</h1>
            <div>
              <a href={companyWebsiteUrl}>Visit</a>
              <BiLinkExternal className="visit-icon" />
            </div>
          </div>

          <p className="job-description">{jobDescription}</p>
          <h1 className="skill-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(eachSkill => {
              const {name} = eachSkill
              return (
                <li key={name}>
                  <img src={eachSkill.image_url} alt={name} />
                  <p>{name}</p>
                </li>
              )
            })}
          </ul>
          <div className="life-at-container">
            <h1>Life at Company</h1>
            <div>
              <p>{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.image_url} alt="life at company" />
            </div>
          </div>
        </div>

        <div className="similar-jobs-container">
          <h1>Similar Jobs</h1>
          <ul>
            {console.log(similarJobs)}
            {similarJobs.map(eachJob => {
              const {id} = eachJob
              console.log(id)
              return (
                <li key={id}>
                  <div className="item-row-1">
                    <img
                      className="item-row-1-col-1"
                      src={eachJob.company_logo_url}
                      alt="similar job company logo"
                    />
                    <div className="item-row-1-col-2">
                      <h1 className="title">{eachJob.title}</h1>
                      <div className="rating-tab">
                        <BsFillStarFill className="star-icon" />
                        <p className="rating">{eachJob.rating}</p>
                      </div>
                    </div>
                  </div>
                  <h1 className="description">Description</h1>
                  <p className="job-description">{eachJob.job_description}</p>
                  <div className="item-row-2">
                    <div className="item-row-2-col-1">
                      <div className="location-tab">
                        <IoLocationSharp />
                        <p className="location">{location}</p>
                      </div>
                      <div className="employment-tab">
                        <BsBriefcaseFill />
                        <p className="employment">{employmentType}</p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onClickJobItemRetry}>
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstrains.initial:
        return this.renderLoadingView()
      case apiStatusConstrains.success:
        return this.renderSuccessView()
      case apiStatusConstrains.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-container">
        <Header />
        {this.renderJobItemDetails()}
      </div>
    )
  }
}

export default JobItemDetails
