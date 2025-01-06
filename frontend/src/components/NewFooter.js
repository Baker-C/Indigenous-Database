import React from 'react'
import '../styles/footer.css'

const linksColumn = [
        { name: 'Home', link: '/' },
        { name: 'Search', link: '/' },
        { name: 'Contact', link: '/' },
        { name: 'Oyate Learning', link: '/' },
        { name: 'Other Resources', link: '/' },
        { name: 'Get Involved', link: '/' },
        { name: 'Report a Problem', link: '/' },
        { name: 'Something Else', link: '/' }
]

const Footer = () => {
    return (
        <footer className="polygon-overlay footer">
            <div className="container">
                <div className="row justify-content-between align-items-center text-center">
                    <div className="col-lg-8 col-md-7 col-sm-12 text-start mb-5">
                        <form>
                            <p className="contact-us-title col-12 ms-5">
                                Contact Us!
                            </p>
                            <div className="mb-3 col-10 ">
                                <label htmlFor="username" className="form-label justify-content-start">
                                    Username
                                </label>
                                <input 
                                type="text" 
                                className="form-control" 
                                id="username" 
                                placeholder="Enter your username" />
                            </div>
                            <div className="mb-3 col-10">
                                <label htmlFor="feedback" className="form-label justify-content-start">
                                    Your Feedback
                                </label>
                                <textarea 
                                className="form-control" 
                                id="feedback" 
                                rows="2" 
                                placeholder="Enter your message here..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                    </div>
                    

                    <FooterColumn column={linksColumn} />

                </div>
            </div>
            <div className="footer-bottom">
                &copy; OIC Learning Collective 2024 . All rights reserved.
            </div>
        </footer>
    )
}

const FooterColumn = ({column}) => {
    return (
        <div className="col-lg-4 col-md-4 col-sm-12 mt-5 mt- mb-3">
            <div className="row row-cols-lg-2 row-cols-md-1 row-cols-sm-2 row-cols-2">
                {column.map(({ name, link }, index) => (
                    <div className="col" key={index}>
                        <ul className="footer-links">
                            <li><a href={link}>{name}</a></li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Footer