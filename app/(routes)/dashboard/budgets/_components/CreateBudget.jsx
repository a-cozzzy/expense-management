"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic for client-side only
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { Budgets } from '@/utils/schema'; // Ensure Budgets is imported correctly

// Dynamically import EmojiPicker to run only on the client side
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

function CreateBudget() {
    const [emojiIcon, setEmojiIcon] = useState('😊');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const { user } = useUser();

    useEffect(() => {
        // This ensures client-only code runs after hydration
    }, []);

    /**
     * Used to Create New Budget
     */
    const onCreateBudget = async () => {
        try {
            const result = await db.insert(Budgets)
                .values({
                    name: name,
                    amount: amount,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    icon: emojiIcon
                }).returning({ insertedId: Budgets.id });

            if (result) {
                toast('New Budget Created!');
            }
        } catch (error) {
            console.error("Error creating budget:", error);
            toast('Failed to create budget. Please try again.');
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
                        <span className='text-3xl'>+</span>
                        <h2>Create New Budget</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button
                                    variant="outline"
                                    className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                    {emojiIcon}
                                </Button>
                                {openEmojiPicker && (
                                    <div className='absolute'>
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setEmojiIcon(e.emoji);
                                                setOpenEmojiPicker(false);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className='mt-4'>
                                    {/* Change h2 to another suitable tag */}
                                    <label className='text-black font-medium my-1'>Budget Name</label>
                                    <Input
                                        placeholder="e.g. Travel"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='mt-4'>
                                    <label className='text-black font-medium my-1'>Budget Amount</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. Rs.2000"
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>


                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)}
                                onClick={onCreateBudget}
                                className="mt-5 w-full">
                                Create Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateBudget;
