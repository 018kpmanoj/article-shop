import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa'

export const metadata = {
  title: 'About - K P Manoj',
  description: 'Learn more about K P Manoj, AI Software Engineer and technology enthusiast',
}

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Section */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center scroll-reveal image-reveal">
            <span className="text-5xl font-bold text-white">KM</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 scroll-reveal stagger-2">
            K P Manoj
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 mb-4 scroll-reveal stagger-3">
            AI Software Engineer | Tech Enthusiast | Creative Soul
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8 scroll-reveal stagger-4">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 scroll-reveal">About Me</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 scroll-reveal stagger-2">
            Welcome! I'm K P Manoj, an AI Software Engineer passionate about exploring the intersection 
            of artificial intelligence, technology trends, and business innovation. With a deep commitment 
            to continuous learning and sharing knowledge, I write about cutting-edge developments in AI, 
            software engineering best practices, and emerging technology trends.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 scroll-reveal stagger-3">
            My mission is to demystify complex technical concepts and make them accessible to both 
            technical and non-technical audiences. Through this platform, I share insights from my 
            experience in building AI-powered solutions and exploring the latest advancements in the field.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed scroll-reveal stagger-4">
            Beyond technology, I'm passionate about creative pursuits and sports. I enjoy drawing, playing 
            cricket and badminton, strategizing in chess, biking through scenic routes, capturing moments 
            through photography, and creating engaging content. These diverse interests fuel my creativity 
            and bring fresh perspectives to my technical work.
          </p>
        </div>

        {/* Expertise Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 scroll-reveal">Areas of Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg scroll-reveal stagger-2 card-hover-lift">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Artificial Intelligence
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Machine Learning, Deep Learning, NLP, Computer Vision, and Agentic AI Systems
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg scroll-reveal stagger-3 card-hover-lift">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Software Engineering
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Full-stack Development, System Architecture, Cloud Computing, and DevOps
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg scroll-reveal stagger-4 card-hover-lift">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Business & Innovation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tech Strategy, Digital Transformation, and Product Development
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg scroll-reveal stagger-5 card-hover-lift">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Content Creation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Technical Writing, Knowledge Sharing, and Community Building
              </p>
            </div>
          </div>
        </div>

        {/* Interests & Hobbies Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 scroll-reveal">Beyond Tech</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 scroll-reveal stagger-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🎨</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Drawing</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🏏</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Cricket</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🏸</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Badminton</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">♟️</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Chess</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🚴</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Biking</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">📸</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Photography</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🎬</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Content Creation</p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-4 rounded-lg text-center">
              <span className="text-3xl mb-2 block">🖼️</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Photo Gallery</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg scroll-reveal">
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
        <div className="text-center mt-12 scroll-reveal">
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

