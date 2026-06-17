import { Head } from '@inertiajs/react';
import React from 'react';

export default function Welcome() {
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
                                <p className="mx-auto mt-6 max-w-[240px] font-mono text-[9px] leading-relaxed tracking-[0.25em] text-emerald-200/90 uppercase">
                                    Sipalay City Integrated Health Services
                                    System
                                </p>
                            </div>
                        </div>

                        {/* RIGHT ACTION PORTALS */}
                        <div className="flex flex-col justify-center px-4 py-6 md:w-1/2">
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
                                <a
                                    href="/login"
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#187e52] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#136642] hover:shadow-lg focus:outline-none"
                                >
                                    Health Worker
                                </a>

                                {/* Button: Lobby Board */}
                                <a
                                    href="/queue"
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#187e52] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#136642] hover:shadow-lg focus:outline-none"
                                >
                                    Job Order
                                </a>

                                <a
                                    href="/queue"
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#187e52] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#136642] hover:shadow-lg focus:outline-none"
                                >
                                    Access Portal
                                </a>

                                {/* Inactive Option */}
                                <button
                                    disabled
                                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e2e8f0] py-4 text-center font-semibold text-slate-400"
                                >
                                    Request for Health Clearance
                                </button>
                            </div>
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
