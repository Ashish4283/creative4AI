import React, { memo } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FieldItem = ({ field, index, updateListItem, removeListItem, generateVarName }) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={field}
            id={field.id}
            dragListener={false}
            dragControls={dragControls}
            className="flex flex-col gap-2 p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-violet-500/50 transition-colors relative group"
        >
            <div
                className="absolute left-2 top-3 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 touch-none z-10"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="w-4 h-4" />
            </div>

            <div className="pl-6">
                <div className="flex gap-2 mb-1">
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Label</label>
                        <input className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none" placeholder="Field Label" value={field.label} onChange={(e) => updateListItem('fields', index, 'label', e.target.value)} />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Variable Name</label>
                        <input
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-300 font-mono focus:border-violet-500 focus:outline-none"
                            placeholder="var_name"
                            value={field.key || generateVarName(field.label)}
                            onChange={(e) => updateListItem('fields', index, 'key', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex-grow">
                        <select className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-400 focus:border-violet-500 focus:outline-none" value={field.type} onChange={(e) => updateListItem('fields', index, 'type', e.target.value)}>
                            <option value="text">Text Input</option>
                            <option value="textarea">Long Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date Picker</option>
                            <option value="select">Dropdown Select</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="boolean">Yes/No Toggle</option>
                            <option value="file">File Upload</option>
                            <option value="image">Image Upload</option>
                            <option value="audio">Audio Upload</option>
                            <option value="video">Video Upload</option>
                            <option value="pdf">PDF Document</option>
                            <option value="document">Word Document</option>
                            <option value="spreadsheet">Excel/CSV</option>
                        </select>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-red-400" onClick={() => removeListItem('fields', index)}><Minus className="w-4 h-4" /></Button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    {(field.type === 'text' || field.type === 'textarea' || field.type === 'number') && (
                        <input
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 focus:border-violet-500 focus:outline-none col-span-2"
                            placeholder="Placeholder..."
                            value={field.placeholder || ''}
                            onChange={(e) => updateListItem('fields', index, 'placeholder', e.target.value)}
                        />
                    )}
                    {field.type === 'select' && (
                        <textarea
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 focus:border-violet-500 focus:outline-none col-span-2 resize-y min-h-[60px]"
                            placeholder="Options (comma separated)"
                            value={field.options || ''}
                            onChange={(e) => updateListItem('fields', index, 'options', e.target.value)}
                        />
                    )}
                    {['file', 'image', 'audio', 'video', 'pdf', 'document', 'spreadsheet'].includes(field.type) && (
                        <>
                            <input
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 focus:border-violet-500 focus:outline-none"
                                placeholder="Accept (e.g. .pdf,.jpg)"
                                value={field.allowedTypes || ''}
                                onChange={(e) => updateListItem('fields', index, 'allowedTypes', e.target.value)}
                            />
                            <div className="flex items-center gap-2 h-full">
                                <input
                                    type="checkbox"
                                    id={`multi-${index}`}
                                    className="rounded bg-slate-900 border-slate-800 text-violet-500 focus:ring-violet-500 w-3 h-3"
                                    checked={field.multiple || false}
                                    onChange={(e) => updateListItem('fields', index, 'multiple', e.target.checked)}
                                />
                                <label htmlFor={`multi-${index}`} className="text-[10px] text-slate-500 cursor-pointer select-none">Multiple</label>
                            </div>
                        </>
                    )}
                    <div className="flex items-center gap-2 h-full">
                        <input
                            type="checkbox"
                            id={`req-${index}`}
                            className="rounded bg-slate-900 border-slate-800 text-violet-500 focus:ring-violet-500 w-3 h-3"
                            checked={field.required || false}
                            onChange={(e) => updateListItem('fields', index, 'required', e.target.checked)}
                        />
                        <label htmlFor={`req-${index}`} className="text-[10px] text-slate-500 cursor-pointer select-none">Required</label>
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
};

export default memo(FieldItem);
