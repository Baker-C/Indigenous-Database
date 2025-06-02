import Hero from './Hero'
import About from './About'
import Features from './Features'
import Reason from './Reason'
import HomeCopy from '../../copy/HomeCopy'


const Home = () => {

    return (
    <div>
        <Hero Copy={HomeCopy.Hero} />
        <div className="home-body-container">
            <About Copy={HomeCopy.About}/>
            <Features Copy={HomeCopy.Features} />
            <Reason Copy={HomeCopy.Reason} />
        </div>
    </div>
    )
}

export default Home