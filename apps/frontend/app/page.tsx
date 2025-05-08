import { Appbar } from "@/components/Appbar"
import { Prompt } from "@/components/Prompt"
import { TemplateButtons } from "@/components/TemplateButtons";

export default function Home() {
  function onClick(){
    return
  }
  return ( 
    <>
      <div className="p-4">
        <Appbar></Appbar>
        <div className="max-w-2xl mx-auto pt-32">
        <div className="text-5xl font-semibold text-center">
          What do you want to build?
        </div>
        <div className="text-muted-foreground text-center mt-3 font-mono">Prompt, click generate and watch you app come to life</div>
        </div>
        <div className="flex justify-center mt-6">
          <Prompt />
        </div>
        <div className="flex gap-4 justify-center mt-6">
              <TemplateButtons 
              text="Create a chess app"
              onTemplateClick={onClick}/>
              <TemplateButtons 
              text="Create a todo app"
              onTemplateClick={onClick}/>
              <TemplateButtons 
              text="Create a docs app"
              onTemplateClick={onClick}/>
              <TemplateButtons 
              text="Create a base app"
              onTemplateClick={onClick}/>
          </div>
      </div>
    </>
  );
}
