'use client'
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Loader2, Plus } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/auth.context';
import axiosInstance from '@/helper/axios';
import { FormDataType } from '@/utils/type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const INITIAL_FORM_DATA: FormDataType = {
  jobPosition: '',
  jobDescription: '',
  experience: '',
  companyInfo: '',
  interviewLanguage: '',
  additionalDetails: '',
};

const AddNewInterview = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id as keyof FormDataType]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      interviewLanguage: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { jobPosition, jobDescription, experience, companyInfo, interviewLanguage, additionalDetails } = formData;
      const response = await axiosInstance.post('/interview/create', {
        jobPosition,
        jobDesc: jobDescription,
        jobExperience: experience,
        companyInfo,
        interviewLanguage,
        additionalDetails,
        userId: user?.id,
      });
      const data = response.data;
      if (data) router.push(`/dashboard/interview/${data.interviewId}`);
      else console.error('Failed to save interview');
    } catch (error) {
      console.error('Error occurred while processing the interview data:', error);
    } finally {
      setFormData(INITIAL_FORM_DATA);
      setLoading(false);
    }
  };

  return (
    <div className='mt-4'>
      <div className='w-[300px]' onClick={() => setDialogOpen(!isDialogOpen)}>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[150px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-sm">
            <div className='flex justify-center items-center gap-x-2'>
              <Plus />
              <span className='text-lg font-medium'>Add New</span>
            </div>
          </ContextMenuTrigger>
        </ContextMenu>
      </div>
      <Dialog open={isDialogOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='text-3xl font-bold'>Tell us more about the job.</DialogTitle>
            <DialogDescription className='text-sm font-medium'>
              Provide details about the job you&apos;re interviewing for.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4">
            <div className="grid grid-cols-2 gap-4 py-4 w-full">
              <div className="flex flex-col gap-4">
                {[{ id: 'jobPosition', label: 'Job Position/Role', placeholder: 'e.g., Frontend Developer' },
                  { id: 'jobDescription', label: 'Tech Stack', placeholder: 'e.g., React, TypeScript, TailwindCSS' },
                  { id: 'experience', label: 'Years of Experience', placeholder: 'e.g., 3 years', type: 'number' }
                ].map(({ id, label, placeholder, type = 'text' }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      placeholder={placeholder}
                      type={type}
                      value={formData[id as keyof FormDataType]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
                <Label htmlFor='Model' className=''>Model</Label>
                <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gemini">Gemini API</SelectItem>
                        <SelectItem value="OpenAI">OpenAI</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="azure">Azure OpenAI</SelectItem>
                        <SelectItem value="Anthropic">Anthropic API</SelectItem>
                        <SelectItem value="Cohere">Cohere API</SelectItem>
                        <SelectItem value="mistral">Mistral AI</SelectItem>
                        <SelectItem value="google">Google PaLM</SelectItem>
                        <SelectItem value="bard">Google Bard</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-4 mt-[0.3rem]">
                {[
                    { id: 'interviewLanguage', label: 'Interview Language', placeholder: 'e.g., English, Japanese' },
                    { id: 'companyInfo', label: 'Company Information', component: Textarea, placeholder: 'Provide additional information about the company' },
                    { id: 'additionalDetails', label: 'Additional Details', component: Textarea, placeholder: 'Add any additional details or requirements for the interview' }
                ].map(({ id, label, placeholder, component: Component = Input }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Component
                      id={id}
                      placeholder={placeholder}
                      value={formData[id as keyof FormDataType]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant='neutral' onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              className={`bg-blue-300 text-black font-medium text-lg ${loading ? 'opacity-70' : ''}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='animate-spin' />
                  <span>Processing...</span>
                </div>
              ) : 'Start Interview'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
