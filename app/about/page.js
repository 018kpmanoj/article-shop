import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa'

export const metadata = {
  title: 'About - KP Manoj',
  description: 'Learn more about KP Manoj, AI Software Engineer and technology enthusiast',
}

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Section */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center">
            <span className="text-5xl font-bold text-white">KM</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            KP Manoj
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 mb-4">
            AI Software Engineer
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <FaLinkedin size={28} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <FaGithub size={28} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <FaTwitter size={28} />
            </a>
            <a href="mailto:contact@kpmanoj.com" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <FaEnvelope size={28} />
            </a>
          </div>
        </div>

        {/* Bio Section */}
        <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Welcome! I'm KP Manoj, an AI Software Engineer passionate about exploring the intersection 
            of artificial intelligence, technology trends, and business innovation. With a deep commitment 
            to continuous learning and sharing knowledge, I write about cutting-edge developments in AI, 
            software engineering best practices, and emerging technology trends.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            My mission is to demystify complex technical concepts and make them accessible to both 
            technical and non-technical audiences. Through this platform, I share insights from my 
            experience in building AI-powered solutions and exploring the latest advancements in the field.
          </p>
        </div>

        {/* Expertise Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Areas of Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Artificial Intelligence
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Machine Learning, Deep Learning, NLP, Computer Vision, and Agentic AI Systems
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Software Engineering
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Full-stack Development, System Architecture, Cloud Computing, and DevOps
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Business & Innovation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tech Strategy, Digital Transformation, and Product Development
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Content Creation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Technical Writing, Knowledge Sharing, and Community Building
              </p>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Resume</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Interested in working together or learning more about my professional background?
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Download Resume (PDF)
            </button>
            <button className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 transition-colors">
              View Online
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            * Resume links will be updated soon
          </p>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Connect
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Have questions or want to collaborate? Feel free to reach out!
          </p>
          <a 
            href="mailto:contact@kpmanoj.com" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  )
}

