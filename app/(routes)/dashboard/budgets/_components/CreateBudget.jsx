"use client";
import React, { useState , useEffect} from 'react';
import dynamic from 'next/dynamic';
import {
    Dialog,
    DialogContent,
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
import { Budgets } from '@/utils/schema';

const CreateBudget = ({ refreshData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [emojiIcon, setEmojiIcon] = useState('💰');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();
    const [currentDate, setCurrentDate] = useState(null);
    
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This will ensure this component is rendered only on the client side
        setCurrentDate(new Date());
        setIsClient(true);
    }, []);

    const resetForm = () => {
        setName('');
        setAmount('');
        setEmojiIcon('💰');
        setOpenEmojiPicker(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const validateInput = () => {
        if (!name.trim()) {
            toast.error('Please enter a budget name');
            return false;
        }
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return false;
        }
        if (!user?.primaryEmailAddress?.emailAddress) {
            toast.error('User email not found');
            return false;
        }
        return true;
    };

    const onCreateBudget = async () => {
        if (!validateInput()) return;

        try {
            setIsSubmitting(true);
            const result = await db.insert(Budgets)
                .values({
                    name: name.trim(),
                    amount: parseFloat(amount),
                    createdBy: user.primaryEmailAddress.emailAddress,
                    icon: emojiIcon,
                    createdAt: new Date() // This is now safe for client-side
                }).returning({ insertedId: Budgets.id });

            if (result) {
                refreshData();
                toast.success('New Budget Created!');
                handleClose();
            }
        } catch (error) {
            console.error("Error creating budget:", error);
            toast.error('Failed to create budget. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className='w-full bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md transition-shadow'>
                    <span className='text-3xl'>+</span>
                    <span className="text-l">Create New Budget</span>
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={(e) => { e.preventDefault(); onCreateBudget(); }} className="space-y-4">
                        <section className="relative">
                            <Button
                                variant="outline"
                                className="text-lg"
                                onClick={() => setOpenEmojiPicker(prev => !prev)}
                                type="button"
                            >
                                {emojiIcon}
                            </Button>
                            {openEmojiPicker && (
                                <div className='absolute z-20 mt-2'>
                                    {isClient && ( // Only render the emoji picker on the client side
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setEmojiIcon(e.emoji);
                                                setOpenEmojiPicker(false);
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </section>

                        <section>
                            <label htmlFor="budgetName" className='block text-sm font-medium text-gray-700 mb-1'>
                                Budget Name
                            </label>
                            <Input
                                id="budgetName"
                                placeholder="e.g. Travel"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={50}
                                required
                            />
                        </section>

                        <section>
                            <label htmlFor="budgetAmount" className='block text-sm font-medium text-gray-700 mb-1'>
                                Budget Amount
                            </label>
                            <Input
                                id="budgetAmount"
                                type="number"
                                placeholder="e.g. 2000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                            />
                        </section>

                        <DialogFooter className="gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !(name && amount)}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Budget'}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateBudget;
