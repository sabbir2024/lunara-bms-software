import { FaFolderOpen } from "react-icons/fa";
import { FcDecision } from "react-icons/fc";
import { useLocation } from "react-router";

const Help = () => {
    const location = useLocation();
    const pathname = location.pathname; // /dashboard/customer/customer-id/1

    // Split by '/' and remove the last segment
    const parts = pathname.split("/").filter(Boolean);
    const lastPart = parts.pop(); // "1"
    const basePath = "/" + parts.join("/");


    return (
        <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button onClick={() => document.getElementById('help').showModal()}><FcDecision title="Help" className="cursor-help" /></button>
            <dialog id="help" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="flex items-center gap-1">
                        <span>Location:</span>
                        <span>{basePath}</span>
                        <FaFolderOpen className="text-info" />
                        <span>{lastPart}</span>
                    </div>
                    {
                        basePath === '/dashboard/customer/customer-id' && (
                            <div>
                                এই ফোল্ডার নির্দেশনা নিচে দেওয়া হল <br />
                                নিউ আইকন ক্লিক করলে একটি ফরম ওপেন হবে। এটি মূলত কাস্টমার যদি বাকি পরিশোধ করে থাকে তাহলে সেই পরিমাণ টাকার লিখে তারিখ লিখে সেভ দিলে তা এন্ট্রি হয়ে যাবে
                                <br />
                                এডিট আইকনে ক্লিক করলে একটি ফরম আসবে যা বিভিন্ন সল্টের কাজে ব্যবহার করা হয়
                                <br />
                                নিচে টেবিলে স্ট্যাটাস পেইড থাকলে ওই তারিখের মূল্য সম্পন্ন পরিশোধ করা হয়েছে, আর যদি ডিউ থাকে সেক্ষেত্রে মূল্য পরিশোধ করা হয়নি
                                <br />
                                ডিটেলস কলাম থেকে আইকনটি ক্লিক করলে ওই তারিখে কি কি পণ্য নেওয়া হয়েছে এবং পরিশোধ করা হয়েছে তা বিস্তারিত দেখা যাবে
                            </div>
                        )
                    }
                    {
                        lastPart === 'gate-pass' && (
                            <div>
                                গেট পাস
                                <br />
                                কাস্টমার ইনফো
                                <br />
                                এটা থেকে মূলত কাস্টমারের নাম লিখলে নিচে সাজেশন দেখাবে সাজেশন ক্লিক করলে কাস্টমারের ডিটেলস দেখাবে। বোনাস হিসেবে চেঞ্জ অপশন থাকবে। যদি কাস্টমার সম্পূর্ণ মিল না থাকে তাহলে নিজের ফর্মটি ফিলাপ করলে অটোমেটিক ভাবে তার সম্পন্ন হয়ে যাবে।
                                <br /><br />

                                প্রোডাক্ট সিলেক্ট
                                <br />
                                এখানে মূলত প্রোডাক্টের নাম লিখে তার সাজেশন দেখাবে এবং ক্লিক করার সঙ্গে সঙ্গে নিচে তার সিলেক্ট হয়ে যাবে। পরবর্তীতে কত পয়েন্টে নিবে সেটা উল্লেখ করে যদি পরিবর্তন করার দরকার হয় তাহলে ডেট পরিবর্তন করতে হবে এবং চাইলে প্রিন্ট করতে পারেন পরবর্তী স্টেজে সেভ এন্ড এড পেমেন্ট ক্লিক করতে হবে।
                                <br />
                                পরবর্তীতে পেট এমন বসাতে হবে
                                <br />
                                সাবমিট গেট পাস ক্লিক করতে হবে ।
                                <br />
                                যদি কাস্টমার ফুল পেমেন্ট করে তাহলে নো দিতে হবে আর যদি বাকিতে নেই তাহলে ইয়েস দিতে হবে
                            </div>
                        )
                    }

                </div>
            </dialog>
        </div>
    );
};

export default Help;

