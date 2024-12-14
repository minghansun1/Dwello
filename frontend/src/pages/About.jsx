import Navbar from "../components/Navbar";

function About() {
    return (
        <div className="pt-16">
            <div>
                <Navbar />
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">About Us</h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Welcome to our website! We are dedicated to helping people find the perfect place to call home. 
                        Whether you're searching for a cozy neighborhood, a bustling city environment, or a location with 
                        specific qualities like affordability or safety, we've got you covered.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed mt-4">
                        Our platform leverages data and user preferences to provide customized insights, making your 
                        home-searching process seamless and stress-free. By focusing on the aspects that matter most 
                        to you, we aim to empower you to make well-informed decisions about where you want to live.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed mt-4">
                        Thank you for choosing us to assist in your journey to find your ideal home. We’re here to 
                        simplify the process and make it enjoyable every step of the way!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;