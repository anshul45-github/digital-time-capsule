// #d4d4d8 color
// 2px height
// 2px dotsize
// 6px gapsize
// horizontal

export const DottedSeparator = () => {
    return (
        <div className="w-full flex items-center my-4">
            <div className="flex-grow" style={{height: '2px', width: '100%', backgroundImage: 'radial-gradient(circle, #d4d4d8 25%, transparent 25%)', backgroundSize: '8px 2px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center'}}></div>
        </div>
    )
}