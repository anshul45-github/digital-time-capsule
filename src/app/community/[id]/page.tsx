interface Props {
    params: {
        id: string;
    }
}

const CommunityIdPage = ({ params }: Props) => {
    return (
        <div>
            Community ID : {params.id}
        </div>
    )
}

export default CommunityIdPage;