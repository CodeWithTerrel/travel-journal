export default function Login() {
    return (
        <section className="space-y-6">
            <div className="inline-block bg-[#0F766E] text-white text-2xl px-6 py-2 rounded-full">
                Login to Travel Journal
            </div>
            <div className="bg-white rounded-xl ring-1 ring-gray-200 p-8 max-w-lg mx-auto shadow">
                <div className="space-y-4">
                    <div>
                        <div className="text-sm font-medium mb-1">Email</div>
                        <div className="h-12 rounded-md border border-slate-300"></div>
                    </div>
                    <div>
                        <div className="text-sm font-medium mb-1">Password</div>
                        <div className="h-12 rounded-md border border-slate-300"></div>
                    </div>
                    <button className="bg-[#0F766E] text-white px-6 py-2 rounded-lg mx-auto block">Login</button>
                    <p className="text-center text-sm text-slate-600">Use admin dummy credentials provided in the assignment.</p>
                </div>
            </div>
        </section>
    );
}
