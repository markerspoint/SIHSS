import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Welcome() {
    const [showLogin, setShowLogin] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [comingSoon, setComingSoon] = useState<string | null>(null);
    return (
        <>
            <Head title="SIHSS Portal Gateway" />
            <div className="bg-grid-pattern relative flex min-h-screen items-center justify-center bg-[#f4f7f6] p-4 font-sans text-slate-800 md:p-8">
                <div className="w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-300 md:p-8">
                    <div className="flex flex-col items-stretch gap-6 md:flex-row">
                        {/* LEFT BRANDING PANEL */}
                        <div className="relative flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] bg-[#00472e] p-8 text-center text-white md:w-1/2">
                            {/* Sipalay Crest Seal Logo Image */}
                            <div className="mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#003d28] p-1 shadow-inner ring-4 ring-amber-400">
                                <img
                                    src="/img/logo.png"
                                    alt="SIHSS Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div className="text-center">
                                <h1 className="text-4xl leading-none font-extrabold tracking-widest text-white">
                                    SIHSS
                                </h1>
                                <p className="mx-auto mt-6 max-w-[240px] font-mono text-[9px] leading-relaxed tracking-[0.25em] text-white uppercase">
                                    Sipalay City Integrated Health Services
                                    System
                                </p>
                            </div>
                        </div>

                        {/* RIGHT ACTION PORTALS */}
                        <div className="flex flex-col justify-center px-4 py-6 md:w-1/2">
                            {comingSoon ? (
                                <div className="text-center py-8 px-4 space-y-6">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-8 w-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-slate-800">Coming Soon</h3>
                                        <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
                                            The <span className="font-semibold text-emerald-800">{comingSoon}</span> is currently under development.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setComingSoon(null)}
                                        className="px-6 py-2.5 bg-[#187e52] hover:bg-[#136642] text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
                                    >
                                        Go Back
                                    </button>
                                </div>
                            ) : !showLogin ? (
                                <>
                                    <div className="mb-8 text-center">
                                        <h3 className="text-3xl font-semibold tracking-tight text-slate-800">
                                            Hi, Sipalayanon
                                        </h3>
                                        <p className="mt-1.5 text-sm text-slate-500">
                                            Select Transaction
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Button: Health Worker Access */}
                                        <button
                                            onClick={() => setComingSoon('Health Worker Portal')}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#187e52] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#136642] hover:shadow-lg focus:outline-none"
                                        >
                                            Health Worker
                                        </button>

                                        {/* Button: Lobby Board */}
                                        <button
                                            onClick={() => setComingSoon('Job Order Portal')}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#187e52] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#136642] hover:shadow-lg focus:outline-none"
                                        >
                                            Job Order
                                        </button>

                                        <button
                                            onClick={() => setShowLogin(true)}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#187e52] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#136642] hover:shadow-lg focus:outline-none"
                                        >
                                            Access Portal
                                        </button>

                                        {/* Inactive Option */}
                                        <button
                                            disabled
                                            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e2e8f0] py-4 text-center font-semibold text-slate-400"
                                        >
                                            Request for Health Clearance
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                                    <div className="mb-6 text-center">
                                        <h3 className="text-3xl font-semibold tracking-tight text-slate-800">
                                            Hi, Sipalayanon
                                        </h3>
                                        <p className="mt-1.5 text-sm text-slate-500">
                                            Sign in to start session
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Employee ID number"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm focus:border-[#187e52] focus:bg-white focus:outline-none transition-all text-slate-800 placeholder-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type={passwordVisible ? 'text' : 'password'}
                                                placeholder="Password"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm focus:border-[#187e52] focus:bg-white focus:outline-none transition-all text-slate-800 placeholder-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={passwordVisible}
                                                onChange={() => setPasswordVisible(!passwordVisible)}
                                                className="h-4 w-4 rounded border-slate-300 text-[#187e52] focus:ring-[#187e52]"
                                            />
                                            Show Password
                                        </label>
                                        <a
                                            href="#forgot"
                                            className="text-[#0d6efd] hover:underline font-semibold"
                                        >
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full cursor-pointer rounded-xl bg-[#187e52] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#136642] hover:shadow-lg focus:outline-none"
                                        >
                                            Login
                                        </button>
                                    </div>

                                    <div className="text-center pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowLogin(false)}
                                            className="cursor-pointer text-sm font-semibold text-slate-600 hover:text-slate-800 hover:underline focus:outline-none"
                                        >
                                            Back to main page
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Card Center Footer */}
                    <div className="mt-6 w-full border-t border-slate-100 pt-4 text-center text-[10.5px] leading-relaxed font-medium text-slate-500">
                        Maintained and Managed by City Health Office (CHO) under
                        the Leadership of City Mayor Maria Gina M. Lizares.
                    </div>
                </div>
            </div>
        </>
    );
}
