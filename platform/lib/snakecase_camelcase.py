def snakecase_to_camelcase(snake_case: str):
    return "".join([word.capitalize() for index, word in enumerate(snake_case.split('_')) if index != 0])

def camelcase_to_snakecase(camelcase: str):
    capitals = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 
        'H', 'I', 'J', 'K', 'L', 'M', 'N', 
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 
        'V', 'W', 'X', 'Y', 'Z'
    ]

    snake = ""
    for index in range(len(camelcase)):
        if index != 0:
            if camelcase[index] in capitals:
                snake += f'_{camelcase[index].lower()}'
            else:
                snake += camelcase[index].lower()
        else:
            snake += camelcase[index].lower()
        
    
    return snake