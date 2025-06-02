import React from 'react';
import SpinWheel from '../components/SpinWheel';
import WheelControls from '../components/WheelControls';
import WheelTools from '../components/WheelTools';
import { useWheel } from '../context/WheelContext';
import { Gift, Target, Share, BarChart4, Sliders, Users, Settings2 } from 'lucide-react';

const Home: React.FC = () => {
  const { items } = useWheel();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Create Your Custom Spinning Wheel
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Perfect for giveaways, random selections, classroom activities, or making hard decisions.
          </p>
        </section>

        {/* Main wheel section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="order-2 lg:order-1 space-y-6">
              <WheelTools />
              <WheelControls />
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center items-center sticky top-24">
              {items.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-full w-80 h-80 flex items-center justify-center p-8 text-center text-gray-500">
                  Add items on the left to create your wheel
                </div>
              ) : (
                <SpinWheel />
              )}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Amazing Features</h2>
            <p className="text-gray-600">Everything you need for the perfect spinning wheel experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="bg-purple-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center text-purple-600">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Wheels</h3>
              <p className="text-gray-600">Create beautiful wheels with unlimited items and custom colors.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="bg-blue-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center text-blue-600">
                <Sliders size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Weighted Selections</h3>
              <p className="text-gray-600">Adjust the probability of each item getting selected.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="bg-green-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center text-green-600">
                <Share size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Your Wheels</h3>
              <p className="text-gray-600">Generate links to share your wheel configurations with others.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="bg-yellow-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center text-yellow-600">
                <Gift size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fun Animations</h3>
              <p className="text-gray-600">Enjoy exciting spin animations and celebratory effects when a winner is selected.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="bg-red-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center text-red-600">
                <BarChart4 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Results History</h3>
              <p className="text-gray-600">Keep track of all your wheel spins with a detailed history log.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="bg-indigo-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center text-indigo-600">
                <Settings2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Export & Import</h3>
              <p className="text-gray-600">Save your wheel configurations for future use or backup.</p>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section id="how-it-works" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-gray-600">Creating and using your spinning wheel is easy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-purple-600">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Items</h3>
              <p className="text-gray-600">Enter all the options you want included in your wheel.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-purple-600">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize Your Wheel</h3>
              <p className="text-gray-600">Adjust colors, weights, and other settings to your preference.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-purple-600">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Spin and Enjoy</h3>
              <p className="text-gray-600">Click the spin button and watch as the wheel decides your winner.</p>
            </div>
          </div>
        </section>

        {/* Examples section */}
        <section id="examples" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Wheel Examples</h2>
            <p className="text-gray-600">Get inspired with these popular wheel use cases</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Classroom Activities", description: "Randomly select students for participation or assign group roles." },
              { title: "Game Night Decisions", description: "Let the wheel decide which game to play next." },
              { title: "Giveaway Winners", description: "Select winners for contests or promotions fairly." },
              { title: "Meal Planning", description: "Can't decide what to cook? Let the wheel decide for you." },
              { title: "Team Assignments", description: "Randomly assign team members to projects or tasks." },
              { title: "Ice Breaker Questions", description: "Spin the wheel for random conversation starters." }
            ].map((example, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{example.title}</h3>
                <p className="text-gray-600 text-sm">{example.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="py-12">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect Wheel?</h2>
              <p className="text-xl mb-8">Start adding items and customize your wheel now!</p>
              <a
                href="#"
                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Get Started
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;