import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Shield, MapPin, Calendar, ArrowRight } from 'lucide-react';
import WarehouseMap from '../components/Map/WarehouseMap';
import { warehouses } from '../data/mockData';

const Home = () => {
  const navigate = useNavigate();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const handleGetStarted = () => {
    if (selectedWarehouse) {
      localStorage.setItem('selectedWarehouse', JSON.stringify(selectedWarehouse));
    }
    navigate('/register');
  };

  const benefits = [
    {
      icon: Calendar,
      title: 'Perfect Gift Timing',
      description: 'Schedule deliveries for birthdays, anniversaries, and special occasions'
    },
    {
      icon: Shield,
      title: 'Avoid Porch Piracy',
      description: "Secure storage until you're ready to receive your packages"
    },
    {
      icon: Clock,
      title: 'Vacation Holds',
      description: "Store packages while you're away and schedule delivery for your return"
    },
    {
      icon: MapPin,
      title: 'Flexible Locations',
      description: 'Redirect office deliveries to home when working remotely'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Order to Our Warehouse',
      description: 'Use our warehouse address as your delivery location when shopping online'
    },
    {
      step: '2',
      title: 'Schedule Your Delivery',
      description: 'Choose your preferred date and time slot for final delivery'
    },
    {
      step: '3',
      title: 'We Handle the Rest',
      description: 'We receive, store, and deliver your package exactly when you want it'
    }
  ];

  return (
    <div className="min-h-screen page-fade">
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[auto,360px] gap-12 items-center">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="burrow-chip">Reschedule anytime</span>
                <span className="burrow-chip">Perfect for gifts & travel</span>
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                  Take control of your deliveries with a warm human touch.
                </h1>
                <p className="mt-6 text-lg text-burrow-text-secondary max-w-xl">
                  Burrow helps you reschedule, redirect, and safeguard every parcel. Your packages arrive exactly when and where you need them.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button onClick={handleGetStarted} className="burrow-button-primary">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button onClick={() => navigate('/login')} className="burrow-button-ghost">
                  Login
                </button>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-burrow-text-secondary">
                <div>
                  <p className="font-semibold text-burrow-text-primary">3,200+</p>
                  <p>Deliveries rescheduled smoothly</p>
                </div>
                <div>
                  <p className="font-semibold text-burrow-text-primary">99.2%</p>
                  <p>Customer happiness score</p>
                </div>
              </div>
            </div>

            <div className="burrow-card relative overflow-hidden">
              <div className="absolute -top-12 -right-10 h-40 w-40 rounded-full bg-burrow-accent/40 blur-3xl" aria-hidden />
              <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-burrow-primary/20 blur-3xl" aria-hidden />
              <div className="relative p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-burrow-primary/10 flex items-center justify-center text-2xl">
                      🐿️
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-wide text-burrow-text-secondary">Burrow Concierge</p>
                      <h2 className="text-2xl font-semibold text-burrow-text-primary">Take Control of Your Deliveries</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-semibold text-burrow-primary hover:text-burrow-secondary transition-colors"
                  >
                    Login
                  </button>
                </div>

                <p className="text-burrow-text-secondary leading-relaxed">
                  Reschedule anytime. Perfect for gifts, travel, or safe storage. Tell us when to deliver and we&apos;ll handle the rest.
                </p>

                <button onClick={handleGetStarted} className="burrow-button-primary w-full justify-between">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-burrow-primary/10 px-4 py-3">
                    <p className="font-semibold text-burrow-primary">Perfect Timing</p>
                    <p className="text-burrow-text-secondary mt-1">Schedule for special occasions</p>
                  </div>
                  <div className="rounded-2xl bg-burrow-secondary/10 px-4 py-3">
                    <p className="font-semibold text-burrow-secondary">Secure Storage</p>
                    <p className="text-burrow-text-secondary mt-1">Avoid porch piracy</p>
                  </div>
                  <div className="rounded-2xl bg-burrow-accent/20 px-4 py-3">
                    <p className="font-semibold text-burrow-text-primary">Flexible</p>
                    <p className="text-burrow-text-secondary mt-1">Redirect with ease</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="burrow-chip">WHY CHOOSE US</span>
            <h2 className="text-4xl font-bold text-burrow-text-primary mb-4 mt-6">Why people love Burrow</h2>
            <p className="text-lg text-burrow-text-secondary max-w-2xl mx-auto">
              Every delivery is cared for like it&apos;s our own. We combine smart logistics with thoughtful service so you never worry about your parcels again.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 fade-stagger">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="burrow-card h-full transition-transform hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-burrow-primary/10 text-burrow-primary mb-6">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-burrow-text-primary mb-2">{benefit.title}</h4>
                <p className="text-burrow-text-secondary text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="h-fit burrow-card overflow-hidden">
              <WarehouseMap
                onWarehouseSelect={setSelectedWarehouse}
                selectedWarehouseId={selectedWarehouse?.id}
              />
            </div>

            <div className="flex flex-col space-y-4 max-h-[650px] overflow-y-auto fade-stagger pr-2">
              {warehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                    selectedWarehouse?.id === warehouse.id
                      ? 'border-burrow-primary bg-white shadow-burrow-soft'
                      : 'border-burrow-border bg-burrow-background/60 hover:border-burrow-primary/50 hover:shadow-burrow-soft'
                  }`}
                  onClick={() => setSelectedWarehouse(warehouse)}
                >
                  <h5 className="font-semibold text-burrow-text-primary text-lg">{warehouse.name}</h5>
                  <p className="text-burrow-text-secondary">{warehouse.address}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-burrow-text-secondary">
                    <span>Capacity: {warehouse.capacity}</span>
                    <span>Hours: {warehouse.operatingHours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="burrow-chip">HOW IT WORKS</span>
            <h2 className="text-4xl font-bold text-burrow-text-primary mb-4 mt-6">Three simple steps</h2>
            <p className="text-lg text-burrow-text-secondary">From checkout to doorstep, we choreograph every moment for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-stagger">
            {howItWorks.map((step, index) => (
              <div key={index} className="burrow-card text-center py-12 px-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-burrow-primary text-white flex items-center justify-center text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-burrow-text-primary mb-3">{step.title}</h3>
                <p className="text-burrow-text-secondary leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="burrow-card relative overflow-hidden text-center py-16 px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-burrow-primary/10 via-transparent to-burrow-secondary/10" aria-hidden />
            <div className="relative space-y-6">
              <h2 className="text-4xl font-bold text-burrow-text-primary">
                Ready to take control of your deliveries?
              </h2>
              <p className="text-lg text-burrow-text-secondary max-w-2xl mx-auto">
                Join thousands of happy households who trust Burrow to choreograph the perfect delivery timing.
              </p>
              <button onClick={handleGetStarted} className="burrow-button-primary">
                Get Started Today
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
