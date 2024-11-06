"use client";
import { Button } from '@/components/ui/button';
import { PenBox } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import { db } from '@/utils/dbConfig';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';
import { Budgets } from '@/utils/schema';

// Dynamically import the EmojiPicker (client-side only)
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

function EditBudget({ budgetInfo, refreshData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon || '💰');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState(budgetInfo?.name || ''); 
    const [amount, setAmount] = useState(budgetInfo?.amount || ''); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();

    // Update the state when budgetInfo changes
    useEffect(() => {
        if (budgetInfo) {
            setEmojiIcon(budgetInfo.icon || '💰');
            setName(budgetInfo.name || '');
            setAmount(budgetInfo.amount || '');
        }
    }, [budgetInfo]);

    const resetForm = () => {
        setEmojiIcon(budgetInfo?.icon || '💰');
        setName('');
        setAmount('');
    };

    const onUpdateBudget = async () => {
        // Guard clause: Do nothing if already submitting
        if (isSubmitting || !name || !amount) return;

        setIsSubmitting(true); // Disable button during submission

        try {
            // Update the budget
            const result = await db.update(Budgets).set({
                name: name,
                amount: amount,
                icon: emojiIcon,
            }).where(eq(Budgets.id, budgetInfo.id))
                .returning();

            if (result) {
                // Close the dialog and reset the form
                setIsOpen(false);
                resetForm();
                refreshData();
                toast.success("Budget updated successfully!");
            }
        } catch (error) {
            console.error("Error updating budget:", error);
            toast.error("Failed to update budget.");
        } finally {
            setIsSubmitting(false); // Enable button after submission is complete
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2">
                    <PenBox /> Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={(e) => { e.preventDefault(); onUpdateBudget(); }} className="space-y-4">
                        <section className="relative">
                            <Button
                                variant="outline"
                                className="text-lg"
                                onClick={() => setOpenEmojiPicker((prev) => !prev)}
                                type="button"
                            >
                                {emojiIcon}
                            </Button>

                            {openEmojiPicker && (
                                <div className="absolute z-20 mt-2">
                                    <EmojiPicker
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji);
                                            setOpenEmojiPicker(false);
                                        }}
                                    />
                                </div>
                            )}
                        </section>

                        <section>
                            <label htmlFor="budgetName" className="block text-sm font-medium text-gray-700 mb-1">
                                Budget Name
                            </label>
                            <Input
                                id="budgetName"
                                placeholder="e.g. Travel"
                                value={name} // Bind to state
                                onChange={(e) => setName(e.target.value)}
                                maxLength={50}
                                required
                            />
                        </section>

                        <section>
                            <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                Budget Amount
                            </label>
                            <Input
                                id="budgetAmount"
                                type="number"
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
                                onClick={() => setIsOpen(false)} // Close dialog on cancel
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !(name && amount)} // Disable when submitting or invalid inputs
                            >
                                {isSubmitting ? 'Updating...' : 'Update Budget'}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EditBudget;
