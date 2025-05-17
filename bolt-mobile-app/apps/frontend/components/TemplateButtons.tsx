
export function TemplateButtons(
    {text, onTemplateClick}: {text:string, onTemplateClick: (text:string) => void}
) {
    return(
        <div>
            <TemplateButton
            text={text}
            onClick={onTemplateClick}
            />
        </div>
    )
}

function TemplateButton(
    {text, onClick,}: {text: string, onClick: (text:string) => void}) {
    return(
        <span
        className="w-fit cursor-pointer border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary px-3 py-1 text-sm transition-theme text-black">
            {text}
        </span>
    )
}