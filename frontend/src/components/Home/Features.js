import '../../styles/home.css'

const Features = ({ Copy }) => {
    return (
        <section className="home-features-container">
            {Copy.map((feature, index) => {
                return (
                    <div key={index} className="home-feature-card">
                        <h2>
                            {feature.Heading}
                        </h2>
                        <p className="p1">
                            {feature.Text}
                        </p>
                    </div>
                )
            })}
        </section>
    )
}

export default Features