import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill, BsFillStarFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <li className="job-item">
      <div className="item-row-1">
        <img className="item-row-1-col-1" src={companyLogoUrl} alt="job" />
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
      <h1 className="description">Description</h1>
      <p className="job-description">{jobDescription}</p>
    </li>
  )
}

export default JobItem
